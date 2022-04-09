
## Installation

```shell
> npm install subeditor
```
## Develop & Unit Test

```shell
> git clone https://github.com/ancientec/subeditor
> cd subeditor
> npm install
> npm run build
```
Open subeditor/tests/index.htm to see all the tests.  
To enable image upload test, you will need to launch example server:  

```shell
> cd subeditor/example/nodejs
> npm install
> node server.js 8000
```
Open and refresh subeditor/tests/index.htm again for all tests including image upload tests will be shown.  

Please note that the 3 tests in test_paste.js cannot be tested in Firefox.
