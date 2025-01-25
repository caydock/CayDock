# w3cay.github.io [![Hexo Deploy CI](https://github.com/w3cay/w3cay.github.io/actions/workflows/HexoCI.yml/badge.svg)](https://github.com/w3cay/w3cay.github.io/actions/workflows/HexoCI.yml)

我的个人主页，欢迎访问 ➡️ http://w3cay.com

SSL 备忘

SSL管理：https://ohttps.com/monitor/certificates?search=&offset=0&limit=10&sortKey=&sortOrder=

证书文件格式

w3cay.com.key

w3cay.com_chain.crt

w3cay.com_public.crt

转换 
openssl x509 -inform PEM -in chain.pem -out w3cay.com_chain.crt

openssl x509 -inform PEM -in cert.pem -out w3cay.com_public.crt

