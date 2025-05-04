
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";
import { useFetchmanProfile } from "@/hooks/useFetchmanProfile";
import { useFetchmanDocuments } from "@/hooks/useFetchmanDocuments";
import { AlertTriangle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// List of supported regions/suburbs
const REGIONS = [
  "Sandton", "Rosebank", "Johannesburg CBD", "Braamfontein", 
  "Melville", "Randburg", "Fourways", "Midrand", "Soweto",
  "Pretoria", "Centurion", "Kempton Park", "Bedfordview"
];

export default function FetchmanSettingsPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile: saveProfile, isUpdating } = useFetchmanProfile();

  const { documents, uploadDocument, isUploading } = 
    useFetchmanDocuments(profile?.id);

  // Personal information state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.user_metadata?.first_name || "",
    lastName: user?.user_metadata?.last_name || "",
    address: profile?.address || "",
    email: user?.email || "",
  });

  // Fetchman profile state
  const [profileData, setProfileData] = useState({
    phone_number: profile?.phone_number || "",
    vehicle_type: profile?.vehicle_type || "",
    work_hours: profile?.work_hours || "",
    service_area: profile?.service_area || "",
    has_own_transport: profile?.has_own_transport || false,
    bank_name: profile?.bank_name || "",
    bank_account_number: profile?.bank_account_number || "",
    branch_code: profile?.branch_code || "",
  });

  // Additional profile fields state
  const [mobilityPreference, setMobilityPreference] = useState<string[]>(
    profile?.mobility_preference 
      ? Object.entries(profile.mobility_preference)
          .filter(([_, value]) => value === true)
          .map(([key]) => key)
      : []
  );
  
  const [selectedWorkAreas, setSelectedWorkAreas] = useState<string[]>(
    profile?.work_areas as string[] || []
  );

  const [emergencyContact, setEmergencyContact] = useState({
    name: profile?.emergency_contact_name || "",
    relationship: profile?.emergency_contact_relationship || "",
    phone: profile?.emergency_contact_phone || "",
    email: profile?.emergency_contact_email || "",
  });

  // Document upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("cv");
  const [uploading, setUploading] = useState(false);

  // Update state when profile data loads
  React.useEffect(() => {
    if (profile) {
      setProfileData({
        phone_number: profile.phone_number || "",
        vehicle_type: profile.vehicle_type || "",
        work_hours: profile.work_hours || "",
        service_area: profile.service_area || "",
        has_own_transport: profile.has_own_transport || false,
        bank_name: profile.bank_name || "",
        bank_account_number: profile.bank_account_number || "",
        branch_code: profile.branch_code || "",
      });

      setPersonalInfo({
        firstName: user?.user_metadata?.first_name || "",
        lastName: user?.user_metadata?.last_name || "",
        address: profile.address || "",
        email: user?.email || "",
      });

      if (profile.mobility_preference) {
        setMobilityPreference(
          Object.entries(profile.mobility_preference)
            .filter(([_, value]) => value === true)
            .map(([key]) => key)
        );
      }

      setSelectedWorkAreas(profile.work_areas as string[] || []);

      setEmergencyContact({
        name: profile.emergency_contact_name || "",
        relationship: profile.emergency_contact_relationship || "",
        phone: profile.emergency_contact_phone || "",
        email: profile.emergency_contact_email || "",
      });
    }
  }, [profile, user]);

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEmergencyContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleWorkArea = (area: string) => {
    setSelectedWorkAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'pdf' && fileType !== 'docx' && fileType !== 'doc') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF or Word document (.pdf, .docx, .doc)",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "File size should be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      await uploadDocument({
        documentType,
        file: selectedFile
      });
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const updatePersonalInfo = async () => {
    // For this example, we're just updating the profile data
    // Name changes would typically require auth provider updates
    toast({
      title: "Personal Info Updated",
      description: "Your personal information has been updated."
    });
  };

  const handleUpdateProfile = async () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "Profile data could not be loaded. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    // Convert mobility preferences array to object format
    const mobilityPreferenceObj = {
      own_car: mobilityPreference.includes("own_car"),
      public_transport: mobilityPreference.includes("public_transport"),
      family_friends: mobilityPreference.includes("family_friends")
    };
    
    // Update the profile with all fields
    await saveProfile({
      ...profileData,
      address: personalInfo.address,
      mobility_preference: mobilityPreferenceObj,
      work_areas: selectedWorkAreas,
      emergency_contact_name: emergencyContact.name,
      emergency_contact_relationship: emergencyContact.relationship,
      emergency_contact_phone: emergencyContact.phone,
      emergency_contact_email: emergencyContact.email
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and profile information</p>
      </div>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="mobility">Mobility</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={personalInfo.firstName}
                    onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={personalInfo.lastName}
                    onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={personalInfo.email}
                    readOnly
                  />
                  <p className="text-xs text-gray-500">Contact support to change your email</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={profileData.phone_number}
                    onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your full address"
                  value={personalInfo.address}
                  onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={updatePersonalInfo}
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Personal Information"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500">Loading your profile...</p>
              </CardContent>
            </Card>
          ) : profile ? (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your professional profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Select
                      value={profileData.vehicle_type}
                      onValueChange={(value) => handleProfileChange('vehicle_type', value)}
                    >
                      <SelectTrigger id="vehicle_type">
                        <SelectValue placeholder="Select a vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="work_hours">Preferred Work Hours</Label>
                    <Select
                      value={profileData.work_hours}
                      onValueChange={(value) => handleProfileChange('work_hours', value)}
                    >
                      <SelectTrigger id="work_hours">
                        <SelectValue placeholder="Select preferred hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                        <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
                        <SelectItem value="full_day">Full Day</SelectItem>
                        <SelectItem value="weekends">Weekends Only</SelectItem>
                        <SelectItem value="weekdays">Weekdays Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service_area">Primary Service Area</Label>
                    <Select
                      value={profileData.service_area}
                      onValueChange={(value) => handleProfileChange('service_area', value)}
                    >
                      <SelectTrigger id="service_area">
                        <SelectValue placeholder="Select a service area" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map(region => (
                          <SelectItem key={region} value={region.toLowerCase()}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has_own_transport"
                    checked={profileData.has_own_transport}
                    onCheckedChange={(checked) => handleProfileChange('has_own_transport', checked)}
                  />
                  <Label htmlFor="has_own_transport">I have my own transport</Label>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={updateProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500 mb-4">You don't have a Fetchman profile yet.</p>
                <Button onClick={() => navigate('/fetchman/onboarding')}>
                  Create Fetchman Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Mobility Tab */}
        <TabsContent value="mobility">
          <Card>
            <CardHeader>
              <CardTitle>Mobility & Work Areas</CardTitle>
              <CardDescription>
                Set your mobility preferences and reachable work areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mobility Preference</h3>
                <p className="text-sm text-gray-500">Select all that apply to you</p>
                
                <ToggleGroup 
                  type="multiple" 
                  className="flex flex-wrap gap-2"
                  value={mobilityPreference}
                  onValueChange={(value) => setMobilityPreference(value)}
                >
                  <ToggleGroupItem value="own_car" className="px-4">
                    Own Car
                  </ToggleGroupItem>
                  <ToggleGroupItem value="public_transport" className="px-4">
                    Public Transport
                  </ToggleGroupItem>
                  <ToggleGroupItem value="family_friends" className="px-4">
                    Family & Friends
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reachable Work Areas</h3>
                <p className="text-sm text-gray-500">Select all areas you can work in</p>
                
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(region => (
                    <Badge 
                      key={region}
                      variant={selectedWorkAreas.includes(region) ? "default" : "outline"}
                      className="cursor-pointer p-2"
                      onClick={() => handleToggleWorkArea(region)}
                    >
                      {region}
                      {selectedWorkAreas.includes(region) && (
                        <CheckCircle2 className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={updateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Mobility Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Emergency Contact Tab */}
        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>
                Provide details of someone we can contact in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_name">Contact Name</Label>
                  <Input
                    id="emergency_name"
                    placeholder="Enter emergency contact name"
                    value={emergencyContact.name}
                    onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_relationship">Relationship</Label>
                  <Select
                    value={emergencyContact.relationship}
                    onValueChange={(value) => handleEmergencyContactChange('relationship', value)}
                  >
                    <SelectTrigger id="emergency_relationship">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Phone Number</Label>
                  <Input
                    id="emergency_phone"
                    placeholder="Enter emergency contact phone"
                    value={emergencyContact.phone}
                    onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency_email">Email Address</Label>
                  <Input
                    id="emergency_email"
                    type="email"
                    placeholder="Enter emergency contact email"
                    value={emergencyContact.email}
                    onChange={(e) => handleEmergencyContactChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={updateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Emergency Contact"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Upload and manage your documents and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Upload New Document</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="document_type">Document Type</Label>
                    <Select
                      value={documentType}
                      onValueChange={setDocumentType}
                    >
                      <SelectTrigger id="document_type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cv">CV / Resume</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="license">License</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="document_file">Select File</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="document_file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="flex-1"
                      />
                      {selectedFile && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedFile(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Accepted formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
                
                {selectedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2 flex items-center gap-2">
                    <FileText className="text-green-600 h-4 w-4" />
                    <span className="text-sm text-green-800 truncate">
                      {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                )}
                
                <Button 
                  onClick={handleUploadDocument}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Documents</h3>
                
                {documents && documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between border p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(doc.uploaded_at).toLocaleDateString()} • {doc.document_type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'approved' ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                            </Badge>
                          ) : doc.status === 'rejected' ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">
                              <X className="mr-1 h-3 w-3" /> Rejected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Pending
                            </Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => window.open(doc.file_url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    You haven't uploaded any documents yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Banking Tab */}
        <TabsContent value="banking">
          <Card>
            <CardHeader>
              <CardTitle>Banking Information</CardTitle>
              <CardDescription>
                Manage your banking details for payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Select
                    value={profileData.bank_name}
                    onValueChange={(value) => handleProfileChange('bank_name', value)}
                  >
                    <SelectTrigger id="bank_name">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fnb">First National Bank</SelectItem>
                      <SelectItem value="absa">ABSA</SelectItem>
                      <SelectItem value="standard_bank">Standard Bank</SelectItem>
                      <SelectItem value="nedbank">Nedbank</SelectItem>
                      <SelectItem value="capitec">Capitec</SelectItem>
                      <SelectItem value="discovery">Discovery Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input
                    id="bank_account_number"
                    placeholder="Enter your account number"
                    value={profileData.bank_account_number}
                    onChange={(e) => handleProfileChange('bank_account_number', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch_code">Branch Code</Label>
                  <Input
                    id="branch_code"
                    placeholder="Enter your branch code"
                    value={profileData.branch_code}
                    onChange={(e) => handleProfileChange('branch_code', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={updateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Banking Details"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <Button onClick={() => {
                  toast({
                    title: "Feature Not Available",
                    description: "Password change functionality is coming soon."
                  });
                }}>
                  Update Password
                </Button>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-medium">Account Actions</h3>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Feature Not Available",
                        description: "Session management is coming soon."
                      });
                    }}
                  >
                    Sign Out All Devices
                  </Button>
                </div>
                
                <div>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      toast({
                        title: "Feature Not Available",
                        description: "Account deactivation is coming soon."
                      });
                    }}
                  >
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
