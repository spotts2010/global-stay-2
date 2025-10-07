'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ClipboardList, IdCard, BookOpenText, FileText, Upload, LinkIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';

type DocumentType = 'license' | 'passport' | 'insurance';

export default function TravelDocumentsPage() {
  const [editing, setEditing] = useState<DocumentType | null>(null);

  const toggleEditing = (docType: DocumentType) => {
    setEditing(editing === docType ? null : docType);
  };

  const documentSections = [
    {
      type: 'license' as DocumentType,
      title: "Driver's License",
      icon: IdCard,
      fields: [
        { id: 'licenseNumber', label: 'License Number' },
        { id: 'expiryDate', label: 'Expiry Date', type: 'date' },
        { id: 'state', label: 'State' },
        { id: 'country', label: 'Country' },
      ],
      files: ['Drivers-License-Front.pdf', 'Drivers-License-Back.pdf'],
    },
    {
      type: 'passport' as DocumentType,
      title: 'Passport',
      icon: BookOpenText,
      fields: [
        { id: 'passportNumber', label: 'Passport Number' },
        { id: 'issueDate', label: 'Date of Issue', type: 'date' },
        { id: 'expiryDate', label: 'Date of Expiry', type: 'date' },
        { id: 'issuingCountry', label: 'Issuing Country' },
      ],
      files: ['Passport-Cover.pdf', 'Passport-Inner.pdf'],
    },
    {
      type: 'insurance' as DocumentType,
      title: 'Travel Insurance',
      icon: FileText,
      fields: [
        { id: 'policyNumber', label: 'Policy Number' },
        { id: 'provider', label: 'Insurance Provider' },
        { id: 'validFrom', label: 'Valid From', type: 'date' },
        { id: 'validTo', label: 'Valid To', type: 'date' },
      ],
      files: ['CoverMore-Insurance.pdf'],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            My Travel Documents
          </CardTitle>
          <CardDescription>
            Securely store and manage your travel documents for quicker bookings.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {documentSections.map((section) => (
            <AccordionItem
              key={section.type}
              value={section.type}
              className="p-4 bg-background border rounded-lg hover:bg-accent/50"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <Separator className="mb-4" />
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Data Fields */}
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor={field.id} className="text-right text-muted-foreground">
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          type={field.type || 'text'}
                          readOnly={editing !== section.type}
                          className={cn('col-span-2', {
                            'bg-white': editing === section.type,
                            'bg-muted/50': editing !== section.type,
                          })}
                        />
                      </div>
                    ))}
                    <div className="flex justify-start pt-2">
                      <Button variant="default" onClick={() => toggleEditing(section.type)}>
                        {editing === section.type ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Attached Files */}
                  <div className="space-y-3">
                    <Label className="font-medium">Attached Files</Label>
                    <div className="space-y-2">
                      {section.files.map((file, index) => (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
                              <LinkIcon className="h-4 w-4" />
                              <span>{file}</span>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Preview Document</DialogTitle>
                              <DialogDescription>
                                Secure document preview is coming soon.
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button variant="default">
                        <Upload className="mr-2 h-4 w-4" />
                        Attach File
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
