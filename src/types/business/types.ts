export interface BusinessIntroductionProps {
  business_name?: string;
  about_business?: string;
  website?: string;
}
export interface BusinessShowCaseProps {
  business_id?: number | undefined;
  images?: File[];
}

export interface BusinessAmenitiesTypeProp {
  id: number | null;
  icon_name: string;
  name: string;
}
