'use client';

import { Heading } from '@/components/ui/Heading';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function AddressesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Heading variant="m" as="h2">
          Address book
        </Heading>
        <Button variant="pill" size="sm">
          <Plus className="h-4 w-4" />
          Add address
        </Button>
      </div>

      <Card variant="base" pad="lg" className="flex flex-col items-start gap-3">
        <Eyebrow muted>No saved addresses</Eyebrow>
        <p className="text-bone/60 max-w-md">
          Add a shipping address to speed up future checkouts. We&apos;ll keep it on file and let you
          manage defaults here.
        </p>
      </Card>
    </div>
  );
}
