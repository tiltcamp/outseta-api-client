import { Store } from '../../util/store';
import { ValidationError } from '../../models/wrappers/validation-error';
import { Request } from '../../util/request';
import { Invoice } from '../../models/billing/invoice';
import { Subscription } from '../../models/billing/subscription';
import { InvoiceLineItem } from '../../models/billing/invoice-line-item';

export class Invoices {
  private readonly store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Manually add an invoice to a subscription. Can be used for manually billing an account.
   * ```typescript
   * const client = new OutsetaApiClient({
   *   subdomain: 'test-company',
   *   apiKey: example_key,
   *   secretKey: example_secret
   * });
   * const response = await client.billing.subscriptions.add({
   *   "Subscription": {
   *     "Uid": "dQGxEz94"
   *   },
   *   "InvoiceDate": new Date('12/29/2021'),
   *   "InvoiceLineItems": [
   *     {
   *       "Description": "Example Item",
   *       "Amount": 50
   *     }
   *   ]
   * });
   * console.log(response);
   * ```
   *
   * @param invoice The invoice to add to Outseta.
   * @returns The response body if response status OK, or response body of validation errors if response status 400.
   * @throws [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) If the server returns a
   *  non-"OK" status, the whole response object will be thrown.
   */
  public async add(invoice: InvoiceAdd): Promise<Invoice | ValidationError<Invoice>> {
    const request = new Request(this.store, 'billing/invoices')
      .authenticateAsServer()
      .withBody(invoice);
    const response = await request.post();

    if (response.status === 400)
      return await response.json() as ValidationError<Invoice>;
    else if (response.ok)
      return await response.json() as Invoice;
    else throw response;
  }
}

export interface InvoiceAdd extends Partial<Omit<Invoice, 'Subscription' | 'InvoiceLineItems'>> {
  [key: string]: unknown;
  Subscription: Required<Pick<Subscription, 'Uid'>> & Partial<Subscription>;
  InvoiceDate: Date;
  InvoiceLineItems: Array<Required<Pick<InvoiceLineItem, 'Amount' | 'Description'>> & Partial<InvoiceLineItem>>
}
