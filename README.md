# Cloud Health Connect
<p align=center>
<a href='http://CloudNativeJS.io/'><img src='https://img.shields.io/badge/homepage-CloudNativeJS-blue.svg'></a>
<a href='https://www.npmjs.com/package/@cloudnative/health-connect'><img src='https://img.shields.io/npm/v/@cloudnative/health-connect' alt='npm'/></a>
<a href="http://travis-ci.org/CloudNativeJS/cloud-health-connect"><img src="https://secure.travis-ci.org/CloudNativeJS/cloud-health-connect.svg?branch=master" alt="Build status"></a>
<a href='https://coveralls.io/github/CloudNativeJS/cloud-health-connect?branch=master'><img src='https://coveralls.io/repos/github/CloudNativeJS/cloud-health-connect/badge.svg?branch=master' alt='Coverage Status' /></a>
<a href='https://greenkeeper.io/'><img src='https://badges.greenkeeper.io/CloudNativeJS/cloud-health-connect.svg' alt='Greenkeeper' /></a>
<a href='http://github.com/CloudNativeJS/ModuleLTS'><img src='https://img.shields.io/badge/Module%20LTS-Adopted-brightgreen.svg?style=flat' alt='Module LTS Adopted' /></a> 
<a href='http://ibm.biz/node-support'><img src='https://img.shields.io/badge/IBM%20Support-Frameworks-brightgreen.svg?style=flat' alt='IBM Support' /></a>   
</p>

Cloud Health Connect provides a Connect Middleware for use in Express.js, Loopback and other frameworks that uses [Cloud Health](http://github.com/CloudNativeJS/cloud-health) to provide:

* Readiness checks
* Liveness checks
* Combined Health (Readiness and Liveness) checks
* Shutdown handling

to enable applications for use with Kubernetes and Cloud Foundry based clouds.

## Using Cloud Health Connect

Cloud Health Connect takes the status reported by [Cloud Health](http://github.com/CloudNativeJS/cloud-health) and makes it available on the liveness and/or readiness URL endpoints that the middleware is configured to use.

The middleware writes the data returned by the Cloud Health module as JSON, and sets the HTTP Status Code as follows:

| Cloud Health Status | Readiness Status Code | Liveness Status Code | Combined Health Status Code |
|---------------------|-----------------------|----------------------|-----------------------------|
| STARTING            | 503 UNAVAILABLE       | 200 OK               | 503 UNAVAILABLE             |
| UP                  | 200 OK                | 200 OK               | 200 OK                      |
| DOWN                | 503 UNAVAILABLE       | 503 UNAVAILABLE      | 503 UNAVAILABLE             |
| STOPPING            | 503 UNAVAILABLE       | 503 UNAVAILABLE      | 503 UNAVAILABLE             |
| STOPPED             | 503 UNAVAILABLE       | 503 UNAVAILABLE      | 503 UNAVAILABLE             |
| -		               | 500 SERVER ERROR      | 500 SERVER ERROR     | 500 SERVER ERROR            |


### Using Cloud Health with Node.js
1. Installation:
  ```bash
  npm install @cloudnative/health-connect
  ```
2. Set up a HealthChecker:

  ```js
  const health = require('@cloudnative/health-connect');
  let healthcheck = new health.HealthChecker();
  ```
  
3. Register a separate Liveness endpoint:

  ```js
  app.use('/live', health.LivenessEndpoint(healthcheck))
  ```
  If no livessness checks are registered, this will report `200 OK` and `UP`.
    
4. Register a separate readiness endpoint:

  ```js
  app.use('/ready', health.ReadinessEndpoint(healthcheck))
  ```
  If no readiness checks are registered, this will report `200 OK` and `UP`.
  
5. Register a combined health endpoint:

  ```js
  app.use('/health', health.HealthEndpoint(healthcheck))
  ```
  If no readiness or liveness checks are registered, this will report `200 OK` and `UP`.

For information on how to register startup, readiness, liveness and shutdown checks, see the [Cloud Health documentation](https://github.com/CloudNativeJS/cloud-health/blob/master/README.md).

#### Health, Liveness and Readiness endpoints

The difference between liveness and readiness endpoints is the purpose: readiness should be used to denote whether an application is "ready" to receive requests, and liveness should be used to denote whether an application is "live" (vs. in a state where it should be restarted.

The combined health endpoint is designed for cloud technologies, such as Cloud Foundry which only support a single endpoint for both liveness and readiness checking.

### Using Cloud Health Connect with Typescript
The Cloud Health Connect module is created in TypeScript and as such provides out of the box TypeScript support.

## Module Long Term Support Policy

This module adopts the [Module Long Term Support (LTS)](http://github.com/CloudNativeJS/ModuleLTS) policy, with the following End Of Life (EOL) dates:

| Module Version   | Release Date | Minimum EOL | EOL With     | Status  |
|------------------|--------------|-------------|--------------|---------|
| 2.x.x	         | May 2019     | April 2021  |              | Current |
| 1.x.x	         | July 2018    | Dec 2019    |              | LTS |


## License

  [Apache-2.0](LICENSE)
