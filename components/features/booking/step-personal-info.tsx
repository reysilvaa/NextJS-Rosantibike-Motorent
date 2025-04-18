'use client';

import { MapPin, User } from 'lucide-react';
import React from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonalInfoStepProps {
  formData: {
    namaCustomer: string;
    noHP: string;
    alamat: string;
    nomorKTP: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="namaCustomer" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Nama Lengkap
          </Label>
          <Input
            id="namaCustomer"
            name="namaCustomer"
            value={formData.namaCustomer}
            onChange={onChange}
            required
            className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="noHP" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Nomor Telepon/WhatsApp
          </Label>
          <Input
            id="noHP"
            name="noHP"
            value={formData.noHP}
            onChange={onChange}
            required
            className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Contoh: 08123456789"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomorKTP" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <path d="M3 10h18" />
            <path d="M7 15h2" />
            <path d="M11 15h6" />
          </svg>
          Nomor KTP
        </Label>
        <Input
          id="nomorKTP"
          name="nomorKTP"
          value={formData.nomorKTP}
          onChange={onChange}
          required
          className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Masukkan 16 digit nomor KTP"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamat" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Alamat
        </Label>
        <Textarea
          id="alamat"
          name="alamat"
          value={formData.alamat}
          onChange={onChange}
          required
          className="bg-background/50 border-input focus:border-primary focus:ring-1 focus:ring-primary min-h-[100px]"
          placeholder="Masukkan alamat lengkap Anda"
        />
      </div>
    </>
  );
}
