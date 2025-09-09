import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyImageUpload, { UploadedImage } from './PropertyImageUpload';
import { animations, variants } from '../theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBuilding, 
  faMapMarkerAlt, 
  faTag, 
  faBed, 
  faBath, 
  faRuler, 
  faCar, 
  faShieldAlt, 
  faTree, 
  faWifi, 
  faWheelchair, 
  faSwimmingPool, 
  faVideo, 
  faChargingStation, 
  faUsers, 
  faRunning, 
  faBolt, 
  faPhone, 
  faTint, 
  faUtensils, 
  faTv, 
  faWind, 
  faCouch, 
  faChair, 
  faUtensilSpoon, 
  faSnowflake, 
  faEye, 
  faMountain, 
  faWater, 
  faRoad, 
  faSeedling, 
  faCity, 
  faUmbrellaBeach, 
  faCheckCircle, 
  faExclamationTriangle, 
  faSpinner,
  faUpload,
  faImage
} from '@fortawesome/free-solid-svg-icons';

// API functions for dropdowns
const getStates = async () => {
  try {
    const response = await axios.get('http://65.0.109.54:5000/api/v1/dropdown/states');
    return response.data;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

const getCities = async (state: string) => {
  try {
    const response = await axios.post('http://65.0.109.54:5000/api/v1/dropdown/cities', { state });
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

const getLocalities = async (city: string, state?: string) => {
  try {
    const response = await axios.post('http://65.0.109.54:5000/api/v1/dropdown/localities', { state, city });
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
  description?: string;
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
  unit?: string;
  
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
  furnishingAmenities?: string[];
  
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
    description: '',
    isSale: 'Sell',
    
    // Property details
    projectName: undefined,
    propertyName: undefined,
    totalBathrooms: undefined,
    totalRooms: undefined,
    propertyPrice: undefined,
    carpetArea: undefined,
    buildupArea: undefined,
    bhks: undefined,
    furnishing: undefined,
    constructionStatus: undefined,
    propertyFacing: undefined,
    ageOfTheProperty: undefined,
    reraApproved: false,
    amenities: [],
    fencing: undefined,
    
    // Dimensions
    width: undefined,
    height: undefined,
    length: undefined,
    totalArea: undefined,
    plotArea: undefined,
    landArea: undefined,
    distFromOutRRoad: undefined,
    unit: undefined,
    
    // Additional fields
    viewFromProperty: [],
    soilType: undefined,
    approachRoad: undefined,
    totalfloors: undefined,
    officefloor: undefined,
    yourfloor: undefined,
    cabins: undefined,
    parking: undefined,
    washroom: undefined,
    availablefor: undefined,
    agentNotes: undefined,
    workingWithAgent: false,
    furnishingAmenities: [],
    
    // Images
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [, setUser] = useState<any>(null);
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
    } else {
      // Redirect to login if no user is found
      navigate('/login');
    }
  }, [navigate]);

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

  const furnishingAmenitiesIcons = [
    { id: 'dining-table', label: 'Dining Table', icon: faUtensils },
    { id: 'washing-machine', label: 'Washing Machine', icon: faWind },
    { id: 'sofa', label: 'Sofa', icon: faCouch },
    { id: 'microwave', label: 'Microwave', icon: faUtensilSpoon },
    { id: 'tv', label: 'TV', icon: faTv },
    { id: 'gas-pipeline', label: 'Gas Pipeline', icon: faTint },
    { id: 'gas-stove', label: 'Gas Stove', icon: faUtensilSpoon },
    { id: 'refrigerator', label: 'Refrigerator', icon: faSnowflake },
    { id: 'water-purifier', label: 'Water Purifier', icon: faTint },
    { id: 'beds', label: 'Beds', icon: faBed },
    { id: 'geyser', label: 'Geyser', icon: faTint },
    { id: 'air-conditioner', label: 'Air-conditioner', icon: faWind },
    { id: 'almirah', label: 'Almirah', icon: faChair },
  ];

  const viewFromPropertyOptions = [
    { id: 'sea', label: 'Sea', icon: faWater },
    { id: 'lake', label: 'Lake', icon: faWater },
    { id: 'park', label: 'Park', icon: faTree },
    { id: 'river', label: 'River', icon: faWater },
    { id: 'mountain', label: 'Mountain', icon: faMountain },
    { id: 'road', label: 'Road', icon: faRoad },
    { id: 'garden', label: 'Garden', icon: faSeedling },
    { id: 'skyline', label: 'Skyline', icon: faCity },
    { id: 'beach', label: 'Beach', icon: faUmbrellaBeach },
    { id: 'forest', label: 'Forest', icon: faTree },
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

    // Clear furnishing amenities when furnishing type is changed to Unfurnished
    if (name === 'furnishing' && value === 'Unfurnished') {
      setFormData(prev => ({
        ...prev,
        furnishingAmenities: []
      }));
    }
  };

  const handleImagesChange = useCallback((newImages: UploadedImage[]) => {
    setFormData(prev => ({ ...prev, images: newImages }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = formData.userId;
      
      // Ensure user is logged in
      if (!userId) {
        setError('Please login to upload properties');
        setLoading(false);
        navigate('/login');
        return;
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
      formDataToSend.append('propertyPrice', formData.propertyPrice?.toString());
      
      // Add all other fields (including empty ones for proper API handling)
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('projectName', formData.projectName || '');
      formDataToSend.append('propertyName', formData.propertyName || '');
      formDataToSend.append('totalBathrooms', formData.totalBathrooms?.toString() || '');
      formDataToSend.append('totalRooms', formData.totalRooms?.toString() || '');
      formDataToSend.append('carpetArea', formData.carpetArea?.toString() || '');
      formDataToSend.append('buildupArea', formData.buildupArea?.toString() || '');
      formDataToSend.append('bhks', formData.bhks || '');
      formDataToSend.append('furnishing', formData.furnishing || '');
      formDataToSend.append('constructionStatus', formData.constructionStatus || '');
      formDataToSend.append('propertyFacing', formData.propertyFacing || '');
      formDataToSend.append('ageOfTheProperty', formData.ageOfTheProperty || '');
      formDataToSend.append('reraApproved', formData.reraApproved?.toString() || 'false');
      formDataToSend.append('amenities', JSON.stringify(formData.amenities || []));
      formDataToSend.append('fencing', formData.fencing || '');
      formDataToSend.append('width', formData.width?.toString() || '0');
      formDataToSend.append('height', formData.height?.toString() || '');
      formDataToSend.append('length', formData.length?.toString() || '');
      formDataToSend.append('totalArea', formData.totalArea?.toString() || '');
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
      formDataToSend.append('furnishingAmenities', JSON.stringify(formData.furnishingAmenities || []));
      formDataToSend.append('unit', formData.unit || '');

      // Add images - send actual File objects for upload
      const successfulImages = formData.images.filter(img => img.file && !img.uploading && !img.error);
      successfulImages.forEach((image) => {
        if (image.file) {
          formDataToSend.append('images', image.file);
        }
      });

      const response = await axios.post('http://65.0.109.54:5000/api/v1/temp/properties', formDataToSend, {
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
          description: '',
          isSale: 'Sell',
          
          // Property details
          projectName: '',
          propertyName: '',
          totalBathrooms: undefined,
          totalRooms: undefined,
          propertyPrice: undefined,
          carpetArea: undefined,
          buildupArea: undefined,
          bhks: undefined,
          furnishing: undefined,
          constructionStatus: undefined,
          propertyFacing: undefined,
          ageOfTheProperty: undefined,
          reraApproved: false,
          amenities: [],
          fencing: undefined,
          
          // Dimensions
          width: undefined,
          height: undefined,
          length: undefined,
          totalArea: undefined,
          plotArea: undefined,
          landArea: undefined,
          distFromOutRRoad: undefined,
          unit: undefined,
          
          // Additional fields
          viewFromProperty: [],
          soilType: undefined,
          approachRoad: undefined,
          totalfloors: undefined,
          officefloor: undefined,
          yourfloor: undefined,
          cabins: undefined,
          parking: undefined,
          washroom: undefined,
          availablefor: undefined,
          agentNotes: undefined,
          workingWithAgent: false,
          furnishingAmenities: [],
          
          // Images
          images: [],
        });

        window.location.reload();
      }
    } catch (err: any) {
      console.error('Error uploading property:', err);
      setError(err.response?.data?.message || 'Property upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to get required fields based on subcategory (excluding amenities)
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
          'unit',
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
          'reraApproved',
          'ageOfTheProperty',
          'propertyFacing',
          'constructionStatus',
          'furnishing',
          'bhks',
        ];
  
      case 'House Villas':
        return [
           "totalBathrooms",
          'propertyPrice',
          'carpetArea',
          'buildupArea',
          'unit',
          'bhks',
          'propertyFacing',
          'furnishing',
          'constructionStatus',
          'ageOfTheProperty',
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
        ];
  
      case 'Hotels':
        return [
          'propertyName',
          'propertyPrice',
          'totalRooms',
          'propertyFacing',
          'furnishing',
          'constructionStatus',
          'ageOfTheProperty',
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
          'unit',
          'totalfloors',
          'yourfloor',
          'furnishing',
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

  // Function to get amenities fields based on subcategory
  const getAmenitiesFields = (subCategory: string): string[] => {
    const amenitiesFields = [];
    
    // Add amenities based on subcategory
    if (['Flats', 'Builder Floors', 'House Villas', 'Farmhouses', 'Hotels', 'Office Spaces'].includes(subCategory)) {
      amenitiesFields.push('amenities');
    }
    
    // Add furnishing amenities for furnished properties
    if (['Flats', 'Builder Floors', 'House Villas', 'Farmhouses', 'Hotels', 'Office Spaces', 'Hostels', 'Shops Showrooms'].includes(subCategory)) {
      amenitiesFields.push('furnishingAmenities');
    }
    
    // Add view from property for specific categories
    if (['Farmhouses', 'Hotels'].includes(subCategory)) {
      amenitiesFields.push('viewFromProperty');
    }
    
    return amenitiesFields;
  };

  // Function to render field based on field name
  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case 'title':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="text-blue-600" />
              Property Title
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.title || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter property title"
            />
          </div>
        );

      case 'description':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="text-blue-600" />
              Property Description
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              rows={4}
              value={formData.description || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter property description"
            />
          </div>
        );

      case 'projectName':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
              Project Name
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.projectName || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter project name"
            />
          </div>
        );

      case 'propertyName':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faHome} className="text-blue-600" />
              Property Name
            </label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData.propertyName || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter property name"
            />
          </div>
        );

      case 'propertyPrice':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="text-blue-600" />
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
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter price"
            />
          </div>
        );

      case 'totalBathrooms':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faBath} className="text-blue-600" />
              Bathrooms
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              value={formData.totalBathrooms || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Number of bathrooms"
            />
          </div>
        );

      case 'totalRooms':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faBed} className="text-blue-600" />
              Rooms
            </label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              min="0"
              value={formData.totalRooms || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Number of rooms"
            />
          </div>
        );

      case 'carpetArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faRuler} className="text-blue-600" />
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
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter carpet area"
            />
          </div>
        );

      case 'buildupArea':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faRuler} className="text-blue-600" />
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
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
              Amenities
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 mt-4">
              {[
                { id: 'parking', label: 'Parking', icon: faCar },
                { id: 'cctv', label: 'CCTV', icon: faVideo },
                { id: 'security', label: 'Security', icon: faShieldAlt },
                { id: 'garden', label: 'Garden', icon: faTree },
                { id: 'wifi', label: 'Free WiFi', icon: faWifi },
                { id: 'wheelchair', label: 'Wheelchair', icon: faWheelchair },
                { id: 'pool', label: 'Infinity Pool', icon: faSwimmingPool },
                { id: 'theater', label: 'Private Theater', icon: faVideo },
                { id: 'ev-charging', label: 'EV Charging', icon: faChargingStation },
                { id: 'clubhouse', label: 'Club House', icon: faUsers },
                { id: 'jogging-track', label: 'Jogging Track', icon: faRunning },
                { id: 'power-backup', label: 'Power Backup', icon: faBolt },
                { id: '24x7-security', label: '24x7 Security', icon: faShieldAlt },
                { id: 'intercom', label: 'Intercom Facility', icon: faPhone },
                { id: 'rain-harvesting', label: 'Rain Water Harvesting', icon: faTint },
              ].map((amenity) => (
                <motion.label 
                key={amenity.id} 
                className="flex flex-col items-center justify-center cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group min-h-[100px] relative"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
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
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <FontAwesomeIcon 
                        icon={amenity.icon} 
                        className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300" 
                      />
                    </div>
                    <span className="text-xs text-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium leading-tight px-1">
                      {amenity.label}
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors duration-300 flex items-center justify-center">
                    {formData.amenities?.includes(amenity.label) && (
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-blue-600 text-xs" 
                      />
                    )}
                  </div>
                </motion.label>
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
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faEye} className="text-blue-600" />
              Views from Property
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 mt-4">
              {viewFromPropertyOptions.map((view) => (
                <motion.label 
                  key={view.id} 
                  className="flex flex-col items-center justify-center cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group min-h-[100px] relative"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input
                    type="checkbox"
                    value={view.label}
                    checked={formData.viewFromProperty?.includes(view.label) || false}
                    onChange={(e) => {
                      const currentViews = formData.viewFromProperty || [];
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          viewFromProperty: [...currentViews, view.label]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          viewFromProperty: currentViews.filter(v => v !== view.label)
                        }));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <FontAwesomeIcon 
                        icon={view.icon} 
                        className="text-2xl text-gray-500 group-hover:text-blue-600 transition-colors duration-300" 
                      />
                    </div>
                    <span className="text-xs text-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium leading-tight px-1">
                      {view.label}
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors duration-300 flex items-center justify-center">
                    {formData.viewFromProperty?.includes(view.label) && (
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-blue-600 text-xs" 
                      />
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
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

      case 'unit':
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faRuler} className="text-blue-600" />
              Unit
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={formData.unit || ''}
              onChange={handleInputChange}
              className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">Select Unit</option>
              <option value="sq ft">Square Feet</option>
              <option value="sq m">Square Meters</option>
              <option value="sq yd">Square Yards</option>
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
            </select>
          </div>
        );

      case 'furnishingAmenities':
        const isUnfurnished = formData.furnishing === 'Unfurnished';
        return (
          <div key={fieldName}>
            <label htmlFor={fieldName} className="form-label flex items-center gap-2">
              <FontAwesomeIcon icon={faCouch} className="text-blue-600" />
              Furnishing Amenities
              {isUnfurnished && (
                <span className="text-gray-500 text-sm ml-2">(Disabled for Unfurnished properties)</span>
              )}
            </label>
            <div className={`grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 mt-4 transition-opacity duration-300 ${isUnfurnished ? 'opacity-50 pointer-events-none' : ''}`}>
              {furnishingAmenitiesIcons.map((amenity) => (
                <motion.label 
                  key={amenity.id} 
                  className="flex flex-col items-center justify-center cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group min-h-[100px] relative"
                  whileHover={!isUnfurnished ? { scale: 1.05, y: -2 } : {}}
                  whileTap={!isUnfurnished ? { scale: 0.95 } : {}}
                >
                  <input
                    type="checkbox"
                    value={amenity.label}
                    checked={formData.furnishingAmenities?.includes(amenity.label) || false}
                    disabled={isUnfurnished}
                    onChange={(e) => {
                      if (isUnfurnished) return; // Prevent changes when disabled
                      const currentAmenities = formData.furnishingAmenities || [];
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          furnishingAmenities: [...currentAmenities, amenity.label]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          furnishingAmenities: currentAmenities.filter(a => a !== amenity.label)
                        }));
                      }
                    }}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <FontAwesomeIcon 
                        icon={amenity.icon} 
                        className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-300" 
                      />
                    </div>
                    <span className="text-xs text-center text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium leading-tight px-1">
                      {amenity.label}
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-300 group-hover:border-blue-500 transition-colors duration-300 flex items-center justify-center">
                    {formData.furnishingAmenities?.includes(amenity.label) && (
                      <FontAwesomeIcon 
                        icon={faCheckCircle} 
                        className="text-blue-600 text-xs" 
                      />
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };



  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4"
      variants={variants.springDrop}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animations.springDrop}
    >
      <div className="container max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FontAwesomeIcon icon={faHome} className="text-2xl text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Upload Property
          </h2>
          <p className="text-gray-600 text-lg">
            List your property for sale or rent with our professional platform
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Address Fields */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Property Address
                  </h3>
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label htmlFor="addressState" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                  State *
                </label>
                <select
                  id="addressState"
                  name="addressState"
                  required
                  value={formData.addressState}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={isLoadingStates}
                >
                  <option value="">{isLoadingStates ? 'Loading states...' : 'Select State'}</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <label htmlFor="addressCity" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faCity} className="text-blue-600" />
                  City *
                </label>
                <select
                  id="addressCity"
                  name="addressCity"
                  required
                  value={formData.addressCity}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              </motion.div>

              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <label htmlFor="addressLocality" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                  Locality *
                </label>
                <select
                  id="addressLocality"
                  name="addressLocality"
                  required
                  value={formData.addressLocality}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              </motion.div>

              {/* Property Type */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Property Type
                  </h3>
                </div>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <label htmlFor="category" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faHome} className="text-blue-600" />
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <label htmlFor="subCategory" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
                  Sub Category *
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  required
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
              </motion.div>

              <motion.div 
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <label htmlFor="isSale" className="form-label flex items-center gap-2">
                  <FontAwesomeIcon icon={faTag} className="text-blue-600" />
                  Sale Type *
                </label>
                <select
                  id="isSale"
                  name="isSale"
                  required
                  value={formData.isSale}
                  onChange={handleInputChange}
                  className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select Sale Type</option>
                  <option value="Sell">Sell</option>
                 {formData.subCategory === "Flats" || formData.subCategory === "Builder Floors" || formData.subCategory === "House Villas" || formData.subCategory === "Farmhouses" || formData.subCategory === 'Office Spaces' || formData.subCategory === 'Shops Showrooms' ? <option value="Rent">Rent</option> :<option value="Lease">Lease</option>}
                </select>
              </motion.div>

               <motion.div 
                 className="form-group"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.4, duration: 0.5 }}
               >
                 <label htmlFor="title" className="form-label flex items-center gap-2">
                   <FontAwesomeIcon icon={faTag} className="text-blue-600" />
                   Property Title
                 </label>
                 <input
                   type="text"
                   id="title"
                   name="title"
                   value={formData.title || ''}
                   onChange={handleInputChange}
                   className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                   placeholder="Enter property title"
                 />
               </motion.div>

               <motion.div 
                 className="lg:col-span-2"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.5, duration: 0.5 }}
               >
                 <label htmlFor="description" className="form-label flex items-center gap-2">
                   <FontAwesomeIcon icon={faTag} className="text-blue-600" />
                   Property Description
                 </label>
                 <textarea
                   id="description"
                   name="description"
                   rows={4}
                   value={formData.description || ''}
                   onChange={handleInputChange}
                   className="form-input focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                   placeholder="Enter property description"
                 />
               </motion.div>

              {/* Dynamic Fields based on SubCategory */}
              <AnimatePresence>
                {getRequiredFields(formData.subCategory).map((field, index) => (
                  <motion.div 
                    key={field} 
                    className="form-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + (index * 0.1), duration: 0.5 }}
                  >
                    {renderField(field)}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Amenities Sections */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.0, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Property Amenities & Features
                  </h3>
                </div>
              </motion.div>

              <AnimatePresence>
                {getAmenitiesFields(formData.subCategory).map((field, index) => (
                  <motion.div 
                    key={field} 
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1 + (index * 0.2), duration: 0.5 }}
                  >
                    {renderField(field)}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Image Upload */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faImage} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Property Images
                  </h3>
                </div>
                <PropertyImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={10}
                />
              </motion.div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                  <span className="text-green-700">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.5 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Uploading Property...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    Upload Property
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default PropertyUploadPage; 