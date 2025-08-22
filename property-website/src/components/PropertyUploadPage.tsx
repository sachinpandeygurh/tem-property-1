import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyImageUpload, { UploadedImage } from './PropertyImageUpload';
import { colors, shadows, animations, variants } from '../theme';

// API functions for dropdowns
const getStates = async () => {
  try {
    const response = await axios.get('https://nextopson.com/api/v1/dropdown/states');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

const getCities = async (state: string) => {
  try {
    const response = await axios.post('https://nextopson.com/api/v1/dropdown/cities', { state });
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

const getLocalities = async (city: string, state?: string) => {
  try {
    const response = await axios.post('https://nextopson.com/api/v1/dropdown/localities', { state, city });
    return response.data;
  } catch (error) {
    console.error('Error fetching localities:', error);
    return [];
  }
};

interface PropertyFormData {
  // Basic required fields
  userId: string;
  addressState: string;
  addressCity: string;
  addressLocality: string;
  category: 'Residential' | 'Commercial';
  subCategory: 'Flats' | 'Builder Floors' | 'House Villas' | 'Plots' | 'Farmhouses' | 'Hotels' | 'Lands' | 'Office Spaces' | 'Hostels' | 'Shops Showrooms';
  title?: string;
  isSale?: 'Sell' | 'Rent' | 'Lease';
  
  // Property details
  projectName?: string;
  propertyName?: string;
  totalBathrooms?: number;
  totalRooms?: number;
  propertyPrice?: number;
  carpetArea?: number;
  buildupArea?: number;
  bhks?: string;
  furnishing?: string;
  constructionStatus?: string;
  propertyFacing?: string;
  ageOfTheProperty?: string;
  reraApproved?: boolean;
  amenities?: string[];
  fencing?: string;
  
  // Dimensions
  width?: number;
  height?: number;
  length?: number;
  totalArea?: number;
  plotArea?: number;
  landArea?: number;
  distFromOutRRoad?: number;
  
  // Additional fields
  viewFromProperty?: string[];
  soilType?: string;
  approachRoad?: string;
  totalfloors?: string;
  officefloor?: string;
  yourfloor?: string;
  cabins?: string;
  parking?: string;
  washroom?: string;
  availablefor?: string;
  agentNotes?: string;
  workingWithAgent?: boolean;
  
  // Images
  images: UploadedImage[];
}

const PropertyUploadPage: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    userId: '',
    addressState: '',
    addressCity: '',
    addressLocality: '',
    category: 'Residential',
    subCategory: 'Flats',
    title: '',
    isSale: 'Sell',
    
    // Property details
    projectName: '',
    propertyName: '',
    totalBathrooms: 0,
    totalRooms: 0,
    propertyPrice: 0,
    carpetArea: 0,
    buildupArea: 0,
    bhks: '',
    furnishing: '',
    constructionStatus: '',
    propertyFacing: '',
    ageOfTheProperty: '',
    reraApproved: false,
    amenities: [],
    fencing: '',
    
    // Dimensions
    width: 0,
    height: 0,
    length: 0,
    totalArea: 0,
    plotArea: 0,
    landArea: 0,
    distFromOutRRoad: 0,
    
    // Additional fields
    viewFromProperty: [],
    soilType: '',
    approachRoad: '',
    totalfloors: '',
    officefloor: '',
    yourfloor: '',
    cabins: '',
    parking: '',
    washroom: '',
    availablefor: '',
    agentNotes: '',
    workingWithAgent: false,
    
    // Images
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Dropdown data states
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);



  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, userId: parsedUser.id }));
    }
    // Removed the redirect to login since after signin, login should not be required
  }, []);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const statesList = await getStates();
        setStates(statesList);
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.addressState) {
      setCities([]);
      setLocalities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        const citiesList = await getCities(formData.addressState);
        setCities(citiesList);
        // Reset city and locality when state changes
        setFormData(prev => ({ ...prev, addressCity: '', addressLocality: '' }));
        setLocalities([]);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    fetchCities();
  }, [formData.addressState]);

  // Fetch localities when city changes
  useEffect(() => {
    if (!formData.addressState || !formData.addressCity) {
      setLocalities([]);
      return;
    }

    const fetchLocalities = async () => {
      setIsLoadingLocalities(true);
      try {
        const localitiesList = await getLocalities(formData.addressCity, formData.addressState);
        setLocalities(localitiesList);
        // Reset locality when city changes
        setFormData(prev => ({ ...prev, addressLocality: '' }));
      } catch (error) {
        console.error('Error fetching localities:', error);
      } finally {
        setIsLoadingLocalities(false);
      }
    };
    fetchLocalities();
  }, [formData.addressState, formData.addressCity]);

  const residentialSubCategories = [
    'Flats', 'Builder Floors', 'House Villas', 'Plots', 'Farmhouses'
  ];

  const commercialSubCategories = [
    'Hotels', 'Lands', 'Office Spaces', 'Hostels', 'Shops Showrooms'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : name === 'propertyPrice' || name === 'totalBathrooms' || name === 'totalRooms' || 
          name === 'carpetArea' || name === 'buildupArea' || name === 'width' || name === 'height' || 
          name === 'length' || name === 'totalArea' || name === 'plotArea' || name === 'landArea' || 
          name === 'distFromOutRRoad'
          ? Number(value) 
          : value
    }));

    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value as 'Residential' | 'Commercial',
        subCategory: value === 'Residential' ? 'Flats' : 'Hotels'
      }));
    }
  };

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let userId = formData.userId;
      
      // If no user is logged in, create a temporary user
      if (!userId || userId === 'temp-user') {
        try {
          const tempUserResponse = await axios.post('https://nextopson.com/api/v1/temp/signup', {
            fullName: 'Guest User',
            email: `guest-${Date.now()}@temp.com`,
            mobileNumber: '0000000000'
          });
          
          if (tempUserResponse.status === 201) {
            userId = tempUserResponse.data.user.id;
            setFormData(prev => ({ ...prev, userId }));
            setUser(tempUserResponse.data.user);
          }
        } catch (err: any) {
          console.error('Error creating temporary user:', err);
          // Continue with temp-user ID if creation fails
        }
      }

      // Validate required fields
      if (!formData.propertyPrice || formData.propertyPrice <= 0) {
        setError('Property price is required and must be greater than 0');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      
      // Add basic property data (always required)
      formDataToSend.append('userId', userId);
      formDataToSend.append('addressState', formData.addressState);
      formDataToSend.append('addressCity', formData.addressCity);
      formDataToSend.append('addressLocality', formData.addressLocality);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subCategory', formData.subCategory);
      formDataToSend.append('isSale', formData.isSale || 'Sell');
      formDataToSend.append('propertyPrice', formData.propertyPrice?.toString() || '0');
      
      // Add all other fields (including empty ones for proper API handling)
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('projectName', formData.projectName || '');
      formDataToSend.append('propertyName', formData.propertyName || '');
      formDataToSend.append('totalBathrooms', formData.totalBathrooms?.toString() || '0');
      formDataToSend.append('totalRooms', formData.totalRooms?.toString() || '0');
      formDataToSend.append('carpetArea', formData.carpetArea?.toString() || '0');
      formDataToSend.append('buildupArea', formData.buildupArea?.toString() || '0');
      formDataToSend.append('bhks', formData.bhks || '');
      formDataToSend.append('furnishing', formData.furnishing || '');
      formDataToSend.append('constructionStatus', formData.constructionStatus || '');
      formDataToSend.append('propertyFacing', formData.propertyFacing || '');
      formDataToSend.append('ageOfTheProperty', formData.ageOfTheProperty || '');
      formDataToSend.append('reraApproved', formData.reraApproved?.toString() || 'false');
      formDataToSend.append('amenities', JSON.stringify(formData.amenities || []));
      formDataToSend.append('fencing', formData.fencing || '');
      formDataToSend.append('width', formData.width?.toString() || '0');
      formDataToSend.append('height', formData.height?.toString() || '0');
      formDataToSend.append('length', formData.length?.toString() || '0');
      formDataToSend.append('totalArea', formData.totalArea?.toString() || '0');
      formDataToSend.append('plotArea', formData.plotArea?.toString() || '0');
      formDataToSend.append('landArea', formData.landArea?.toString() || '0');
      formDataToSend.append('distFromOutRRoad', formData.distFromOutRRoad?.toString() || '0');
      formDataToSend.append('viewFromProperty', JSON.stringify(formData.viewFromProperty || []));
      formDataToSend.append('soilType', formData.soilType || '');
      formDataToSend.append('approachRoad', formData.approachRoad || '');
      formDataToSend.append('totalfloors', formData.totalfloors || '');
      formDataToSend.append('officefloor', formData.officefloor || '');
      formDataToSend.append('yourfloor', formData.yourfloor || '');
      formDataToSend.append('cabins', formData.cabins || '');
      formDataToSend.append('parking', formData.parking || '');
      formDataToSend.append('washroom', formData.washroom || '');
      formDataToSend.append('availablefor', formData.availablefor || '');
      formDataToSend.append('agentNotes', formData.agentNotes || '');
      formDataToSend.append('workingWithAgent', formData.workingWithAgent?.toString() || 'false');

      // Add images - only add successfully uploaded images
      const successfulImages = formData.images.filter(img => img.key && !img.uploading && !img.error);
      successfulImages.forEach((image) => {
        if (image.key) {
          formDataToSend.append('imageKeys', image.key);
        }
      });

      // Debug: Log all form data being sent
      console.log('Form Data being sent to API:');
      console.log('formData object:', formData);
      console.log('FormData created successfully with all fields');

      const response = await axios.post('https://nextopson.com/api/v1/temp/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess('Property uploaded successfully!');
        // Reset form
        setFormData({
          userId: formData.userId,
          addressState: '',
          addressCity: '',
          addressLocality: '',
          category: 'Residential',
          subCategory: 'Flats',
          title: '',
          isSale: 'Sell',
          
          // Property details
          projectName: '',
          propertyName: '',
          totalBathrooms: 0,
          totalRooms: 0,
          propertyPrice: 0,
          carpetArea: 0,
          buildupArea: 0,
          bhks: '',
          furnishing: '',
          constructionStatus: '',
          propertyFacing: '',
          ageOfTheProperty: '',
          reraApproved: false,
          amenities: [],
          fencing: '',
          
          // Dimensions
          width: 0,
          height: 0,
          length: 0,
          totalArea: 0,
          plotArea: 0,
          landArea: 0,
          distFromOutRRoad: 0,
          
          // Additional fields
          viewFromProperty: [],
          soilType: '',
          approachRoad: '',
          totalfloors: '',
          officefloor: '',
          yourfloor: '',
          cabins: '',
          parking: '',
          washroom: '',
          availablefor: '',
          agentNotes: '',
          workingWithAgent: false,
          
          // Images
          images: [],
        });
      }
    } catch (err: any) {
      console.error('Error uploading property:', err);
      setError(err.response?.data?.message || 'Property upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get required fields based on subcategory
  const getRequiredFields = (subCategory: string): string[] => {
    switch (subCategory) {
      case 'Flats':
        return [
          'projectName',
          'propertyPrice',
          'totalBathrooms',
          'totalfloors',
          'yourfloor',
          'carpetArea',
          'buildupArea',
          'amenities',
          'constructionStatus',
          'furnishing',
          'bhks',
        ];
  
      case 'Builder Floors':
        return [
          'projectName',
          'propertyPrice',
          'totalfloors',
          'yourfloor',
          'amenities',
          'reraApproved',
          'ageOfTheProperty',
          'propertyFacing',
          'constructionStatus',
          'furnishing',
          'bhks',
        ];
  
      case 'House Villas':
        return [
          'propertyPrice',
          'carpetArea',
          'buildupArea',
          'bhks',
          'propertyFacing',
          'furnishing',
          'constructionStatus',
          'ageOfTheProperty',
          'amenities',
        ];
  
      case 'Plots':
        return [
          'propertyPrice',
          'length',
          'width',
          'propertyFacing',
          'reraApproved',
        ];
  
      case 'Farmhouses':
        return [
          'totalBathrooms',
          'length',
          'width',
          'bhks',
          'furnishing',
          'propertyFacing',
          'ageOfTheProperty',
          'reraApproved',
          'viewFromProperty',
          'amenities',
        ];
  
      case 'Hotels':
        return [
          'propertyName',
          'propertyPrice',
          'totalRooms',
          'propertyFacing',
          'furnishing',
          'amenities',
          'constructionStatus',
          'ageOfTheProperty',
          'viewFromProperty',
        ];
  
      case 'Lands':
        return [
          'landArea',
          'distFromOutRRoad',
          'propertyPrice',
          'soilType',
          'approachRoad',
          'fencing',
        ];
  
      case 'Office Spaces':
        return [
          'projectName',
          'propertyPrice',
          'carpetArea',
          'buildupArea',
          'totalfloors',
          'yourfloor',
          'furnishing',
          'amenities',
          'constructionStatus',
          'propertyFacing',
          'washroom',
          'reraApproved',
          'ageOfTheProperty',
        ];
  
      case 'Hostels':
        return [
          'propertyName',
          'propertyPrice',
          'totalRooms',
          'totalArea',
          'plotArea',
          'totalfloors',
          'furnishing',
          'constructionStatus',
          'propertyFacing',
          'ageOfTheProperty',
        ];
  
      case 'Shops Showrooms':
        return [
          'propertyPrice',
          'length',
          'width',
          'totalfloors',
          'yourfloor',
          'furnishing',
          'constructionStatus',
          'propertyFacing',
          'ageOfTheProperty',
          'parking',
          'reraApproved',
          'washroom',
        ];
  
      default:
        return ['propertyName', 'propertyPrice'];
    }
  };

  // Function to render field based on field name
  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case 'title':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Property Title
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.title || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter property title"
            />
          </div>
        );

      case 'projectName':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Project Name
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.projectName || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter project name"
            />
          </div>
        );

      case 'propertyName':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Property Name
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.propertyName || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter property name"
            />
          </div>
        );

      case 'propertyPrice':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Price (₹) *
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              required
              min="1"
              value={formData.propertyPrice || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter price"
            />
          </div>
        );

      case 'totalBathrooms':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Bathrooms
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              value={formData.totalBathrooms || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Number of bathrooms"
            />
          </div>
        );

      case 'totalRooms':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Rooms
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              value={formData.totalRooms || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Number of rooms"
            />
          </div>
        );

      case 'carpetArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Carpet Area (sq ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.carpetArea || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter carpet area"
            />
          </div>
        );

      case 'buildupArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Built-up Area (sq ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.buildupArea || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter built-up area"
            />
          </div>
        );

      case 'bhks':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              BHKs
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.bhks || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select BHKs</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="5+ BHK">5+ BHK</option>
            </select>
          </div>
        );

      case 'furnishing':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Furnishing
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.furnishing || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Furnishing</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        );

      case 'constructionStatus':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Construction Status
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.constructionStatus || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Status</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
              <option value="New Launch">New Launch</option>
            </select>
          </div>
        );

      case 'propertyFacing':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Property Facing
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.propertyFacing || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Facing</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </select>
          </div>
        );

      case 'ageOfTheProperty':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Age of Property
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.ageOfTheProperty || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Age</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
        );

      case 'amenities':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: 'parking', label: 'Parking' },
                { id: 'cctv', label: 'CCTV' },
                { id: 'security', label: 'Security' },
                { id: 'garden', label: 'Garden' },
                { id: 'wifi', label: 'Free WiFi' },
                { id: 'wheelchair', label: 'Wheelchair' },
                { id: 'pool', label: 'Infinity Pool' },
                { id: 'theater', label: 'Private Theater' },
                { id: 'ev-charging', label: 'EV Charging' },
                { id: 'clubhouse', label: 'Club House' },
                { id: 'jogging-track', label: 'Jogging Track' },
                { id: 'power-backup', label: 'Power Backup' },
                { id: '24x7-security', label: '24x7 Security' },
                { id: 'intercom', label: 'Intercom Facility' },
                { id: 'rain-harvesting', label: 'Rain Water Harvesting' },
              ].map((amenity) => (
                <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={amenity.label}
                    checked={formData.amenities?.includes(amenity.label) || false}
                    onChange={(e) => {
                      const currentAmenities = formData.amenities || [];
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          amenities: [...currentAmenities, amenity.label]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          amenities: currentAmenities.filter(a => a !== amenity.label)
                        }));
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'reraApproved':
        return (
          <div key={fieldName} className="flex items-center">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={formData.reraApproved || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={fieldName} className="ml-2 block text-sm text-gray-900">
              RERA Approved
            </label>
          </div>
        );

      case 'length':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Length (ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.length || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter length"
            />
          </div>
        );

      case 'width':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Width (ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.width || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter width"
            />
          </div>
        );

      case 'totalfloors':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Total Floors
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.totalfloors || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter total floors"
            />
          </div>
        );

      case 'yourfloor':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Your Floor
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.yourfloor || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your floor"
            />
          </div>
        );

      case 'viewFromProperty':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Views from Property
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={3}
              value={formData.viewFromProperty?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                viewFromProperty: e.target.value.split(',').map(item => item.trim()).filter(item => item)
              }))}
              className="form-input"
              placeholder="Enter views (comma separated)"
            />
          </div>
        );

      case 'landArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Land Area (sq ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.landArea || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter land area"
            />
          </div>
        );

      case 'distFromOutRRoad':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Distance from Main Road (km)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.distFromOutRRoad || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter distance"
            />
          </div>
        );

      case 'soilType':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Soil Type
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.soilType || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Soil Type</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
              <option value="Laterite">Laterite</option>
            </select>
          </div>
        );

      case 'approachRoad':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Approach Road
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.approachRoad || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Road Type</option>
              <option value="Metalled">Metalled</option>
              <option value="Unmetalled">Unmetalled</option>
              <option value="Kutcha">Kutcha</option>
            </select>
          </div>
        );

      case 'fencing':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Fencing
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.fencing || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Fencing</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
        );

      case 'totalArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Total Area (sq ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.totalArea || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter total area"
            />
          </div>
        );

      case 'plotArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Plot Area (sq ft)
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              step="0.01"
              value={formData.plotArea || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter plot area"
            />
          </div>
        );

      case 'parking':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Parking
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.parking || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select Parking</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="Street Parking">Street Parking</option>
            </select>
          </div>
        );

      case 'washroom':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label">
              Washrooms
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              value={formData.washroom || ''}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Number of washrooms"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.GRAY_50 }}
        variants={variants.springDrop}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={animations.springDrop}
      >
        <div 
          className="text-center p-8 rounded-xl"
          style={{ 
            backgroundColor: colors.WHITE,
            boxShadow: shadows.xl
          }}
        >
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ color: colors.TEXT_COLOR }}
          >
            Welcome to Property Upload
          </h2>
          <p 
            className="mb-6"
            style={{ color: colors.GRAY_600 }}
          >
            You can upload properties without logging in. Your data will be saved as a temporary account.
          </p>
          <button
            onClick={() => setUser({ id: 'temp-user', fullName: 'Guest User' })}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
            style={{ 
              backgroundColor: colors.PRIMARY_COLOR,
              color: colors.WHITE,
              boxShadow: shadows.md
            }}
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen md:py-12 px-4"
      variants={variants.springDrop}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animations.springDrop}
    >
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Property
          </h2>
          <p className="text-gray-600">
            List your property for sale or rent
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="card"
        >
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Fields */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Property Address
                </h3>
              </div>

              <div className="form-group">
                <label htmlFor="addressState" className="form-label">
                  State *
                </label>
                <select
                  id="addressState"
                  name="addressState"
                  required
                  value={formData.addressState}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={isLoadingStates}
                >
                  <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="addressCity" className="form-label">
                  City *
                </label>
                <select
                  id="addressCity"
                  name="addressCity"
                  required
                  value={formData.addressCity}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!formData.addressState || isLoadingCities}
                >
                  <option value="">
                    {!formData.addressState 
                      ? 'Select State first' 
                      : isLoadingCities 
                        ? 'Loading cities...' 
                        : 'Select City'
                    }
                  </option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="addressLocality" className="form-label">
                  Locality *
                </label>
                <select
                  id="addressLocality"
                  name="addressLocality"
                  required
                  value={formData.addressLocality}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!formData.addressCity || isLoadingLocalities}
                >
                  <option value="">
                    {!formData.addressCity 
                      ? 'Select City first' 
                      : isLoadingLocalities 
                        ? 'Loading localities...' 
                        : 'Select Locality'
                    }
                  </option>
                  {localities.map((locality) => (
                    <option key={locality} value={locality}>
                      {locality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Type</h3>
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subCategory" className="form-label">
                  Sub Category *
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  required
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {formData.category === 'Residential' 
                    ? residentialSubCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))
                    : commercialSubCategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="isSale" className="form-label">
                  Sale Type *
                </label>
                <select
                  id="isSale"
                  name="isSale"
                  required
                  value={formData.isSale}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Sale Type</option>
                  <option value="Sell">Sell</option>
                 {formData.subCategory === "Flats" || formData.subCategory === "Builder Floors" || formData.subCategory === "House Villas" || formData.subCategory === "Farmhouses" ? <option value="Rent">Rent</option> :<option value="Lease">Lease</option>}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Property Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter property title"
                />
              </div>

              {/* Dynamic Fields based on SubCategory */}
              {getRequiredFields(formData.subCategory).map(field => (
                <div key={field} className="form-group">
                  {renderField(field)}
                </div>
              ))}

              {/* Image Upload */}
              <div className="md:col-span-2">
                <label htmlFor="images" className="form-label">
                  Property Images
                </label>
                <PropertyImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={10}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success mt-4">
                {success}
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2" />
                    Uploading Property...
                  </div>
                ) : (
                  'Upload Property'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PropertyUploadPage; 