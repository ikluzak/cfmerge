//
// NOTE:

This package is under construction,

The eventual goal is to allow me to structure my projects how I want and
provide bits of extracted swagger or yaml and merge it all together into
a single cloud formation template.

I know you can use cloudformation snippets and includes but that doesn't
seem to be exactly what I want so i'm experimenting with this.

-----

I'm expecting the cfmerge.yml config file to look something like this:

```
# Generate a 'whole project' CloudFormation template at build time
version: 0.1

# Define the API-gw used for this project and use a swagger file we exported from API-gw
apigw:
  exclude: true		# Skip this block for now
  rname: ResourceName
  name: API-Name
  description: Your API Description
  type: AWS::ApiGateway::RestApi
  file: apigw/swagger.yml

#
# Define the lambda's used by this project
# Output template files from "aws cloudformation package"
lambda:
  files:
    - /tmp/cf-package-out1.yml
    - /tmp/cf-package-out2.yml

# Define any necessary tables
dynamodb:
  exclude: true		# Skip this block for now
  files:
    - table1
    - table2
```

