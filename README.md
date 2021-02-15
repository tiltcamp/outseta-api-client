# Outseta REST API Client

[![Build Status](https://img.shields.io/github/workflow/status/tiltcamp/outseta-api-client/CI/main)](https://github.com/tiltcamp/outseta-api-client/actions?query=branch%3Amain)
[![Test Coverage](https://img.shields.io/codacy/coverage/e981251e6d9c4fb0a201c5e4adaebf9f/main)](https://app.codacy.com/gh/tiltcamp/outseta-api-client/dashboard)
[![Code Quality Grade](https://img.shields.io/codacy/grade/e981251e6d9c4fb0a201c5e4adaebf9f/main)](https://app.codacy.com/gh/tiltcamp/outseta-api-client/dashboard)
[![Latest Version](https://img.shields.io/npm/v/outseta-api-client)](https://www.npmjs.com/package/outseta-api-client)
[![NPM Bundle Size](https://img.shields.io/bundlephobia/minzip/outseta-api-client)](https://www.npmjs.com/package/outseta-api-client)
[![License](https://img.shields.io/github/license/tiltcamp/outseta-api-client)](https://github.com/tiltcamp/outseta-api-client/blob/main/LICENSE)


***This package is currently a work in progress, so the structure is subject to change and there's stuff missing 
(see the list of implemented endpoints below).***

## Quick Start

### Installing
NPM:
```shell
npm install outseta-api-client --save
```

Yarn:
```shell
yarn add outseta-api-client
```
### Importing
```typescript
import OutsetaApiClient from 'outseta-api-client';
```
or
```javascript
var OutsetaApiClient = require('outseta-api-client');
```

### Initialization

In the following examples, the subdomain is the beginning of your Outseta domain - so if your Outseta domain
is `test-company.outseta.com`, it would be just `test-company` as seen below.

#### Initializing without any keys:
```typescript
const client = new OutsetaApiClient({ subdomain: 'test-company' });
```
#### Initializing with server-side API keys:
```typescript
const client = new OutsetaApiClient({
  subdomain: 'test-company',
  apiKey: example_key,
  secretKey: example_secret
});
```

#### Initializing with a user access token:
```typescript
const client = new OutsetaApiClient({
  subdomain: 'test-company',
  accessToken: jwt_user_token
});
```

## Resources & Documentation
#### Billing
- [Invoices](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_invoices.invoices.html#add)
- [Plans](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_plans.plans.html#getall)
- [Plan Families](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_plan_families.planfamilies.html#getall)
- [Subscriptions](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_subscriptions.subscriptions.html#add)
- [Transactions](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_plan_transactions.transactions.html#getall)
- [Usage](https://tiltcamp.github.io/outseta-api-client/classes/api_billing_usage.usage.html#add)

#### CRM
- [Accounts](https://tiltcamp.github.io/outseta-api-client/classes/api_crm_accounts.accounts.html#add)
- [Activities](https://tiltcamp.github.io/outseta-api-client/classes/api_crm_activities.activities.html#add)
- Deals (planned)
- [People](https://tiltcamp.github.io/outseta-api-client/classes/api_crm_people.people.html#add)

#### Marketing
- Subscribers (planned)

#### Support
- Cases (planned)

#### User
- [Impersonate](https://tiltcamp.github.io/outseta-api-client/classes/api_user.user.html#impersonate)
- [Login](https://tiltcamp.github.io/outseta-api-client/classes/api_user.user.html#login)
- [Password](https://tiltcamp.github.io/outseta-api-client/classes/api_user_password.password.html#update)
- [Profile](https://tiltcamp.github.io/outseta-api-client/classes/api_user_profile.profile.html#get)
