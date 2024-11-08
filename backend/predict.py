import sys
import pandas as pd
import joblib
import re
import tldextract
from urllib.parse import urlparse, parse_qs
import math
from bs4 import BeautifulSoup
import requests
import warnings
from urllib3.exceptions import InsecureRequestWarning
from sklearn.exceptions import InconsistentVersionWarning

warnings.filterwarnings("ignore", category=InconsistentVersionWarning)



# Suppress InsecureRequestWarning
warnings.simplefilter('ignore', InsecureRequestWarning)
warnings.filterwarnings("ignore")

# Load the saved model
rf_model_loaded = joblib.load('random_forest_model.pkl')

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Cache-Control': 'max-age=0'
}

def ShannonEntropy(entropyType):
    probabilities = [float(entropyType.count(c)) / len(entropyType) for c in dict.fromkeys(list(entropyType))]
    return -sum([p * math.log(p) / math.log(2.0) for p in probabilities])

def make_request(url):
    try:
        response = requests.get(url, headers=headers, timeout=10, verify=False)  # verify=False suppresses SSL certificate verification
        response.raise_for_status()
        return response
    except requests.HTTPError as e:
        if e.response.status_code == 503:
            return None
        return None
    except requests.RequestException as e:
        return None

def HasTitle(url):
    try:
        response = make_request(url)
        if response is None:
            return 0
        hasTitle = BeautifulSoup(response.content, 'html.parser').title
        return 1 if hasTitle else 0
    except Exception as e:
        return 0

def hasFavicon(url):
    try:
        response = make_request(url)
        if response is None:
            return 0
        return 1 if BeautifulSoup(response.content, 'html.parser').find("link", rel=re.compile(r'^(shortcut )?icon$', re.I)) else 0
    except Exception as e:
        return 0

def hasCopyRightInfo(url):
    try:
        response = make_request(url)
        if response is None:
            return 0
        for element in BeautifulSoup(response.content, 'html.parser').find_all(['footer', 'div', 'span', 'p', 'small', 'a']):
            text = element.get_text().lower()
            for keyword in ['copyright', '©']:
                if keyword in text:
                    return 1
        return 0
    except Exception as e:
        return 0

def hasRedirects(url):
    try:
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True, verify=False)  # verify=False suppresses SSL certificate verification
        return 1 if len(response.history) else 0
    except requests.RequestException as e:
        return 0

def preprocess_url(url):
    try:
        parseUrl = urlparse(url)
        domainInfo = tldextract.extract(url)
        queryParameters = parse_qs(parseUrl.query)
        url_length = len(url)
        num_dots = url.count('.')
        domain_length = url.split('/')[2].count('-') if len(url.split('/')) > 2 else 0
        num_hyphens = url.count('-')
        num_underscores = url.count('_')
        num_slashes = url.count('/')
        num_digits = sum(c.isdigit() for c in url)
        num_special_characters = len(url) - sum(c.isalnum() for c in url)
        num_capital_letters = sum(c.isupper() for c in url)
        num_subdomains = url.count('.')
        isDomainIP = int(re.match(r'^\d{1,3}(\.\d{1,3}){3}$', parseUrl.netloc) is not None)
        tldLength = len(domainInfo.suffix)
        numOfDirectories = len(parseUrl.path.split('/')) - 1
        pathEntropy = ShannonEntropy(parseUrl.path)
        noOfParameters = len(queryParameters)
        queryEntropy = ShannonEntropy(parseUrl.query)
        isHTTPs = int(parseUrl.scheme == 'https')
        noOfObusfucation = len(re.findall(r'%[0-9A-Fa-f]{2}', url))
        hasTitle = HasTitle(url)
        hasFavIcon = hasFavicon(url)
        hasCopyRight = hasCopyRightInfo(url)
        hasRedirect = hasRedirects(url)
        url_features = {
            'UrlLength': url_length,
            'DomainLength': domain_length,
            'NumOfDots': num_dots,
            'NumOfHypens': num_hyphens,
            'NumOfUnderscores': num_underscores,
            'NumOfSlashes': num_slashes,
            'NumOfDigits': num_digits,
            'NumOfSpecialCharacters': num_special_characters,
            'NumOfCaptialLetters': num_capital_letters,
            'NumOfSubdomains': num_subdomains,
            'IsDomainIP': isDomainIP, 
            'TLDLength': tldLength,  
            'NumOfDirectories': numOfDirectories,
            'PathEntropy': pathEntropy,
            'NumOfParameters': noOfParameters,
            'QueryEntropy': queryEntropy,
            'IsHTTPS': isHTTPs,
            'NoOfObusfucatedCharacters': noOfObusfucation,
            'HasTitle': hasTitle,
            'HasFavicon': hasFavIcon,
            'HasCopyRightInfo': hasCopyRight,
            'HasURLRedirects': hasRedirect
        }

        return url_features
    except Exception as e:
        return None

def predict_url(url):
    if 'www' not in url:
        if url.startswith('http://'):
            url = url.replace('http://', 'http://www.')
        elif url.startswith('https://'):
            url = url.replace('https://', 'https://www.')
        else:
            url = 'https://www.' + url
    url_features = preprocess_url(url)
    if url_features is None:
        return "Phishing"
    url_df = pd.DataFrame([url_features])
    predicted_label = rf_model_loaded.predict(url_df)
    return predicted_label[0]

def interpret_label(predicted_label):
    if predicted_label == 0:
        return "Phishing"
    elif predicted_label == 1:
        return "Legitimate"
    else:
        return "Unknown"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    user_url = sys.argv[1]
    predicted_label = predict_url(user_url)
    label_interpreted = interpret_label(predicted_label)
    print(label_interpreted)
