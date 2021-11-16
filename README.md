```
 _           _ _       _      _      _       
| |         | | |     | |    | |    | |      
| |__  _   _| | | ____| | ___| | ___| |_ ___ 
| '_ \| | | | | |/ / _` |/ _ \ |/ _ \ __/ _ \
| |_) | |_| | |   < (_| |  __/ |  __/ ||  __/
|_.__/ \__,_|_|_|\_\__,_|\___|_|\___|\__\___|

```

**Quickly search and delete multiple GitHub repositories by name**

bulkdelete is a simple console application to delete multiple GitHub repositories easily via the command line.

It is intended for use in organizations, such as schools and other educational institutions, that frequently create repositories according to specific naming schemes and need to delete them after some time.

Please use bulkdelete with caution!!!

**Installation**

bulkdelete requires a Node.js environment. You can install bulkdelete using the npm package manager:

```
sudo npm install bulkdelete --global
```

The tool requires a token to access the GitHub API. You can create such an access token in the GitHub settings:

https://github.com/settings/tokens

The GitHub access token and the GitHub organization name can be placed in the `config.json` file included in this package:

```
{
    "GITHUB_TOKEN": "KEEP_IT_SECRET",
    "GITHUB_ORG": ""
}
```

Alternatively, the token can be specified as command line parameter.

Please make sure to keep your GitHub access token private!

**Usage**

```
Options:
  -V, --version                             output the version number
  -t,--token <your GitHub access token>     your GitHub access token
  -q,--query <query string>                 GitHub API query string to search for the specific item
  -o,--org <your GitHub organization name>  your GitHub organization name
  -f,--force                                delete repositories without user reconfirmation
  -h, --help                                display help for command
  ```

The search string must be built according to the GitHub API requirements. For more information on the structure of query strings, see

https://docs.github.com/en/rest/reference/search

**A simple example**

In the following example, all repositories that contain the string 'test' in their name and belong to the organization 'foo' are to be deleted.

```
bulkdelete -t 123456789 -o foo -s test
```

**License**

MIT License
