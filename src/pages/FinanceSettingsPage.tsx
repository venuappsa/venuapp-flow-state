
import { useState, useEffect } from 'react';
import HostPanelLayout from '@/components/layouts/HostPanelLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Save, CreditCard } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

interface PaymentSettings {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchCode: string;
  paymentMethod: string;
  paypalEmail: string;
}

export default function FinanceSettingsPage() {
  const { user } = useUser();
  const [settings, setSettings] = useState<PaymentSettings>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    branchCode: '',
    paymentMethod: 'bank',
    paypalEmail: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem(`host_payment_settings_${user?.id}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const handleChange = (key: keyof PaymentSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);

    // Validate the form
    if (settings.paymentMethod === 'bank') {
      if (!settings.bankName || !settings.accountNumber || !settings.accountName || !settings.branchCode) {
        toast({
          title: 'Missing information',
          description: 'Please complete all bank details',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }
    } else if (settings.paymentMethod === 'paypal') {
      if (!settings.paypalEmail) {
        toast({
          title: 'Missing information',
          description: 'Please enter your PayPal email',
          variant: 'destructive'
        });
        setIsSaving(false);
        return;
      }
    }

    // Save to localStorage
    try {
      localStorage.setItem(`host_payment_settings_${user?.id}`, JSON.stringify(settings));
      
      toast({
        title: 'Settings saved',
        description: 'Your payment settings have been updated',
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'An error occurred while saving your settings',
        variant: 'destructive'
      });
    }
    
    setIsSaving(false);
  };

  return (
    <HostPanelLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Payment Settings</h1>
            <p className="text-gray-500">Manage how you receive payments from events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Choose how you want to receive payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select
                    value={settings.paymentMethod}
                    onValueChange={(value) => handleChange('paymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.paymentMethod === 'bank' && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={settings.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="Enter your bank name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input
                        id="accountName"
                        value={settings.accountName}
                        onChange={(e) => handleChange('accountName', e.target.value)}
                        placeholder="Enter the name on your account"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={settings.accountNumber}
                          onChange={(e) => handleChange('accountNumber', e.target.value)}
                          placeholder="Enter your account number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="branchCode">Branch Code</Label>
                        <Input
                          id="branchCode"
                          value={settings.branchCode}
                          onChange={(e) => handleChange('branchCode', e.target.value)}
                          placeholder="Enter your branch code"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settings.paymentMethod === 'paypal' && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                    <div>
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={settings.paypalEmail}
                        onChange={(e) => handleChange('paypalEmail', e.target.value)}
                        placeholder="Enter your PayPal email address"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Payment Settings'}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </HostPanelLayout>
  );
}
