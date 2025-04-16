'use client';

import { AlertCircle, ArrowLeft, ArrowRight, CreditCard, Loader2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { useBooking } from '@/hooks/booking/use-booking';
import type { MotorcycleUnit } from '@/lib/types';

// Import the step components
import BookingSummary from './booking-summary';
import BookingDetailsStep from './step-booking-details';
import ConfirmationStep from './step-confirmation';
import PersonalInfoStep from './step-personal-info';
import StepProgress from './step-progress';

interface BookingFormProps {
  motorcycle: MotorcycleUnit;
  startDate: Date;
  endDate: Date;
  onSuccess?: () => void;
}

export default function BookingForm({
  motorcycle,
  startDate,
  endDate,
  onSuccess,
}: BookingFormProps) {
  // Use the booking hook instead of maintaining state and logic here
  const {
    formData,
    handleChange,
    formError,
    currentStep,
    totalSteps,
    _nextStep,
    prevStep,
    handleNext,
    priceBreakdown,
    isSubmitting,
    _isCalculating,
    isCheckingAvailability,
    isAvailable,
    handleSubmit,
  } = useBooking({
    motorcycle,
    startDate,
    endDate,
    onSuccess,
  });

  return (
    <Card className="bg-card border-border shadow-lg animate-fadeIn">
      <CardHeader className="bg-secondary/30 rounded-t-lg border-b border-border pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Formulir Pemesanan Motor
        </CardTitle>
        <CardDescription>
          Lengkapi data diri Anda untuk menyewa motor
          <span className="block mt-1 text-warning">
            <span className="font-medium">Catatan:</span> Keterlambatan pengembalian dikenakan denda
            Rp 15.000/jam
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} id="bookingForm" className="space-y-5">
          <StepProgress currentStep={currentStep} totalSteps={totalSteps} />

          <BookingSummary motorcycle={motorcycle} startDate={startDate} endDate={endDate} />

          {currentStep === 1 && <PersonalInfoStep formData={formData} onChange={handleChange} />}

          {currentStep === 2 && (
            <BookingDetailsStep
              formData={formData}
              motorcycle={motorcycle}
              onChange={handleChange}
            />
          )}

          {currentStep === 3 && (
            <ConfirmationStep
              formData={formData}
              motorcycle={motorcycle}
              startDate={startDate}
              endDate={endDate}
              priceBreakdown={priceBreakdown}
            />
          )}

          {isCheckingAvailability && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loading size="sm" text="Memeriksa ketersediaan motor..." />
            </div>
          )}

          {!isAvailable && currentStep === 3 && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>
                Motor tidak tersedia pada rentang waktu yang dipilih. Silakan pilih waktu lain.
              </span>
            </div>
          )}

          {formError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
              {formError}
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-border pt-6">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2"
            disabled={isCheckingAvailability}
          >
            {isCheckingAvailability ? (
              <Loading size="sm" text="Memeriksa..." />
            ) : (
              <>
                Lanjutkan
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="submit"
            form="bookingForm"
            disabled={isSubmitting || !isAvailable}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>Konfirmasi Pemesanan</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
