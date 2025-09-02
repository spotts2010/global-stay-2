'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// --- SVG Icons ---
const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    id="Icons"
    height="32"
    viewBox="0 0 60 60"
    width="32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect fill="#25a3da" height="38" rx="4" width="58" x="1" y="10" />
    <circle cx="47" cy="41" fill="#ec3a48" r="3" />
    <rect fill="#fccb55" height="10" rx="2" width="12" x="5" y="15" />
    <circle cx="52" cy="41" fill="#fccb55" r="3" />
    <g fill="#295474">
      <path d="m46 24a1 1 0 0 1 -.648-1.761 1.509 1.509 0 0 0 0-2.478 1 1 0 0 1 1.3-1.522 3.5 3.5 0 0 1 0 5.522.991.991 0 0 1 -.652.239z" />
      <path d="m49 27a1 1 0 0 1 -.729-1.684 6.251 6.251 0 0 0 0-8.632 1 1 0 1 1 1.458-1.368 8.249 8.249 0 0 1 0 11.368 1 1 0 0 1 -.729.316z" />
      <path d="m52 29a1 1 0 0 1 -.706-1.709 8.666 8.666 0 0 0 0-12.582 1 1 0 0 1 1.412-1.418 10.668 10.668 0 0 1 0 15.418 1 1 0 0 1 -.706.291z" />
      <path d="m11 44h-5a1 1 0 0 1 0-2h5a1 1 0 0 1 0 2z" />
      <path d="m14 34h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" />
      <path d="m24 34h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" />
      <path d="m34 34h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" />
      <path d="m44 34h-6a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z" />
      <path d="m20 44h-5a1 1 0 0 1 0-2h5a1 1 0 0 1 0 2z" />
      <path d="m23 38h-4a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z" />
      <path d="m28 38h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2z" />
      <path d="m33 38h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2z" />
    </g>
    <path d="m10 25v-3h7v-2h-3v-5h-2v5h-2v-5h-2v5h-3v2h3v3z" fill="#e2b550" />
  </svg>
);

const BitcoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32" {...props}>
    <g transform="translate(-289.60744,-341.50536)">
      <g transform="matrix(0.61129216,0,0,0.61129216,170.80346,315.53734)">
        <path
          style={{ fill: '#F7931A' }}
          d="M1019.337,562.575c-55.934,224.349-283.161,360.884-507.536,304.938    c-224.283-55.933-360.819-283.174-304.86-507.51C262.848,135.628,490.076-0.921,714.386,55.012    C938.747,110.946,1075.27,338.213,1019.337,562.575z"
        />
        <path
          style={{ fill: '#FFFFFF' }}
          d="M475.38,531.795c-2.277,5.654-8.048,14.134-21.057,10.914c0.459,0.668-33.397-8.336-33.397-8.336    l-22.81,52.596l59.793,14.907c11.124,2.787,22.026,5.705,32.757,8.454l-19.016,76.349l45.896,11.451l18.832-75.538    c12.538,3.402,24.708,6.543,36.617,9.501l-18.767,75.184l45.949,11.451l19.015-76.205c78.352,14.827,137.268,8.847,162.068-62.019    c19.984-57.058-0.994-89.973-42.218-111.435c30.022-6.923,52.635-26.671,58.668-67.463l0,0    c8.336-55.724-34.092-85.68-92.106-105.664l18.819-75.486l-45.949-11.451l-18.321,73.496c-12.079-3.01-24.486-5.85-36.813-8.664    l18.452-73.981l-45.922-11.451l-18.832,75.459c-9.999-2.277-19.813-4.529-29.341-6.897l0.052-0.236l-63.367-15.822l-12.224,49.076    c0,0,34.092,7.813,33.372,8.297c18.61,4.646,21.973,16.96,21.411,26.724L475.38,531.795z M692.727,548.821    c-14.199,57.058-110.27,26.212-141.417,18.478l25.232-101.148C607.688,473.924,707.567,489.314,692.727,548.821z M706.939,400.782    c-12.956,51.903-92.917,25.533-118.855,19.068l22.876-91.74C636.898,334.575,720.432,346.641,706.939,400.782z"
        />
      </g>
    </g>
  </svg>
);

const PayPalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width="32"
    height="32"
    {...props}
  >
    <path
      style={{ fill: '#002987' }}
      d="M428.876,132.28c0.867-7.045,1.32-14.218,1.32-21.497C430.196,49.6,380.597,0,319.413,0H134.271 c-11.646,0-21.589,8.41-23.521,19.894l-68.22,405.475c-2.448,14.55,8.768,27.809,23.521,27.809h67.711 c11.646,0,21.776-8.404,23.707-19.889c0,0,0.113-0.673,0.317-1.885h0.001l-9.436,56.086C146.195,500.313,156.08,512,169.083,512 h59.237c10.265,0,19.029-7.413,20.731-17.535l16.829-100.02c2.901-17.242,17.828-29.867,35.311-29.867h15.562 c84.53,0,153.054-68.525,153.054-153.054C469.807,178.815,453.639,149.902,428.876,132.28z"
    />
    <path
      style={{ fill: '#0085CC' }}
      d="M428.876,132.28c-10.594,86.179-84.044,152.91-173.086,152.91h-51.665 c-11.661,0-21.732,7.767-24.891,18.749l-30.882,183.549C146.195,500.312,156.08,512,169.083,512h59.237 c10.265,0,19.029-7.413,20.731-17.535l16.829-100.02c2.901-17.242,17.828-29.867,35.311-29.867h15.562 c84.53,0,153.054-68.525,153.054-153.054l0,0C469.807,178.815,453.639,149.902,428.876,132.28z"
    />
    <path
      style={{ fill: '#00186A' }}
      d="M204.125,285.19h51.665c89.043,0,162.493-66.731,173.086-152.909 c-15.888-11.306-35.304-17.978-56.29-17.978h-134.85c-15.353,0-28.462,11.087-31.01,26.227l-27.493,163.408 C182.392,292.956,192.464,285.19,204.125,285.19z"
    />
  </svg>
);

// --- Data ---
const paymentMethods = [
  {
    id: 'pm_1',
    type: 'VISA',
    details: 'ending in 4242',
    expiry: 'Expires 08/26',
    icon: CreditCardIcon,
  },
  {
    id: 'pm_2',
    type: 'PayPal',
    details: 'ID: sam.p@example.com',
    expiry: null,
    icon: PayPalIcon,
  },
  {
    id: 'pm_3',
    type: 'Bitcoin',
    details: 'Wallet: 1A1zP1eP5QGefi2D...',
    expiry: null,
    icon: BitcoinIcon,
  },
];

export default function PaymentMethodsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">Payment Methods</CardTitle>
          <CardDescription>Add and manage your payment methods.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Feature Coming Soon</DialogTitle>
              <DialogDescription>
                This functionality is currently under development. Please check back later.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4"
            >
              <div className="flex items-center gap-4">
                <method.icon />
                <div>
                  <p>
                    <span className="font-semibold">{method.type}</span>{' '}
                    <span>{method.details}</span>
                  </p>
                  {method.expiry && (
                    <p className="text-sm text-muted-foreground">{method.expiry}</p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
