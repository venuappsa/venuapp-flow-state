
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  onRegister: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  icon: Icon,
  title,
  description,
  benefits,
  onRegister,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="h-6 w-6 mr-2 text-venu-orange" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Benefits:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            className="bg-venu-orange hover:bg-venu-orange/90 w-full" 
            onClick={onRegister}
          >
            Register as {title}
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Download size={18} />
            <span>Download App (Coming Soon)</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;

