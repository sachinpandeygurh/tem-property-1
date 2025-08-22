import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { colors, shadows, animations, variants } from '../theme';

interface TempUser {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  userType: string;
  createdAt: string;
}

interface TempProperty {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  propertyPrice: number;
  userId: string;
}

const AdminPanel: React.FC = () => {
  const [tempUsers, setTempUsers] = useState<TempUser[]>([]);
  const [tempProperties, setTempProperties] = useState<TempProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'create'>('users');

  // Form states for creating temp users
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: ''
  });

  // Form states for creating temp properties
  const [propertyForm, setPropertyForm] = useState({
    userId: '',
    title: '',
    description: '',
    category: 'Residential',
    subCategory: 'Flats',
    propertyPrice: 0,
    carpetArea: 0,
    totalBathrooms: 0,
    totalRooms: 0,
    address: ''
  });

  useEffect(() => {
    fetchTempUsers();
    fetchTempProperties();
  }, []);

  const fetchTempUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/temp/users');
      setTempUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching temp users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTempProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/v1/temp/properties');
      setTempProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching temp properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTempUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/v1/temp/signup', userForm);
      setUserForm({
        fullName: '',
        email: '',
        mobileNumber: ''
      });
      fetchTempUsers();
      alert('Temporary user created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating temporary user');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTempProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/v1/temp/properties', propertyForm);
      setPropertyForm({
        userId: '',
        title: '',
        description: '',
        category: 'Residential',
        subCategory: 'Flats',
        propertyPrice: 0,
        carpetArea: 0,
        totalBathrooms: 0,
        totalRooms: 0,
        address: ''
      });
      fetchTempProperties();
      alert('Temporary property created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating temporary property');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTempUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this temporary user?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/v1/temp/users/${userId}`);
        fetchTempUsers();
        alert('Temporary user deleted successfully!');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting temporary user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteTempProperty = async (propertyId: string) => {
    if (window.confirm('Are you sure you want to delete this temporary property?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/v1/temp/properties/${propertyId}`);
        fetchTempProperties();
        alert('Temporary property deleted successfully!');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting temporary property');
      } finally {
        setLoading(false);
      }
    }
  };

  const residentialSubCategories = [
    'Flats', 'Builder Floors', 'House Villas', 'Plots', 'Farmhouses'
  ];

  const commercialSubCategories = [
    'Hotels', 'Lands', 'Office Spaces', 'Hostels', 'Shops Showrooms'
  ];

  return (
    <motion.div 
      className="min-h-screen py-8 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={animations.ease}
    >
      <motion.div 
        className="container"
        variants={variants.slideUp}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="card"
          variants={variants.scale}
          whileHover={{ 
            scale: 1.01,
            boxShadow: shadows['2xl']
          }}
          transition={animations.ease}
        >
          {/* Header */}
          <motion.div 
            className="card-header"
            variants={variants.fadeIn}
          >
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Panel - Temporary Accounts
            </h1>
            <p className="text-gray-600">
              Manage temporary users and properties
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="border-b border-gray-200"
            variants={variants.fadeIn}
          >
            <nav className="-mb-px flex space-x-8 px-6">
              <motion.button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Temporary Users ({tempUsers.length})
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('properties')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'properties'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Temporary Properties ({tempProperties.length})
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create New
              </motion.button>
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="card-body"
            variants={variants.fadeIn}
            initial="initial"
            animate="animate"
          >
            {loading && (
              <motion.div 
                className="text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-2 text-gray-600">
                  Loading...
                </p>
              </motion.div>
            )}

            {/* Temporary Users Tab */}
            {activeTab === 'users' && !loading && (
              <motion.div
                variants={variants.slideUp}
                initial="initial"
                animate="animate"
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  Temporary Users
                </h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Type</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempUsers.map((user) => (
                        <motion.tr 
                          key={user.id}
                          variants={variants.fadeIn}
                          initial="initial"
                          animate="animate"
                          whileHover={{ 
                            backgroundColor: colors.GRAY_50,
                            scale: 1.01
                          }}
                          transition={animations.ease}
                        >
                          <td className="font-medium text-gray-900">
                            {user.fullName}
                          </td>
                          <td className="text-gray-500">
                            {user.email}
                          </td>
                          <td className="text-gray-500">
                            {user.mobileNumber}
                          </td>
                          <td className="text-gray-500">
                            {user.userType}
                          </td>
                          <td className="text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <motion.button
                              onClick={() => handleDeleteTempUser(user.id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Temporary Properties Tab */}
            {activeTab === 'properties' && !loading && (
              <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Temporary Properties</h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Price</th>
                        <th>User ID</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempProperties.map((property) => (
                        <tr key={property.id}>
                          <td className="font-medium text-gray-900">
                            {property.title}
                          </td>
                          <td className="text-gray-500">
                            {property.category}
                          </td>
                          <td className="text-gray-500">
                            {property.subCategory}
                          </td>
                          <td className="text-gray-500">
                            ₹{property.propertyPrice.toLocaleString()}
                          </td>
                          <td className="text-gray-500">
                            {property.userId}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteTempProperty(property.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Create New Tab */}
            {activeTab === 'create' && !loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Temporary User */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Create Temporary User</h2>
                  <form onSubmit={handleCreateTempUser} className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={userForm.fullName}
                        onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={userForm.mobileNumber}
                        onChange={(e) => setUserForm({ ...userForm, mobileNumber: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full"
                    >
                      Create Temporary User
                    </button>
                  </form>
                </div>

                {/* Create Temporary Property */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Create Temporary Property</h2>
                  <form onSubmit={handleCreateTempProperty} className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">User ID</label>
                      <input
                        type="text"
                        required
                        value={propertyForm.userId}
                        onChange={(e) => setPropertyForm({ ...propertyForm, userId: e.target.value })}
                        className="form-input"
                        placeholder="Enter temporary user ID"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        required
                        value={propertyForm.title}
                        onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        required
                        value={propertyForm.description}
                        onChange={(e) => setPropertyForm({ ...propertyForm, description: e.target.value })}
                        rows={3}
                        className="form-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          value={propertyForm.category}
                          onChange={(e) => setPropertyForm({ 
                            ...propertyForm, 
                            category: e.target.value,
                            subCategory: e.target.value === 'Residential' ? 'Flats' : 'Hotels'
                          })}
                          className="form-input"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Sub Category</label>
                        <select
                          value={propertyForm.subCategory}
                          onChange={(e) => setPropertyForm({ ...propertyForm, subCategory: e.target.value })}
                          className="form-input"
                        >
                          {propertyForm.category === 'Residential' 
                            ? residentialSubCategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))
                            : commercialSubCategories.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                              ))
                          }
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={propertyForm.propertyPrice}
                          onChange={(e) => setPropertyForm({ ...propertyForm, propertyPrice: Number(e.target.value) })}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Carpet Area (sq ft)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={propertyForm.carpetArea}
                          onChange={(e) => setPropertyForm({ ...propertyForm, carpetArea: Number(e.target.value) })}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Address</label>
                      <textarea
                        required
                        value={propertyForm.address}
                        onChange={(e) => setPropertyForm({ ...propertyForm, address: e.target.value })}
                        rows={2}
                        className="form-input"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-success w-full"
                    >
                      Create Temporary Property
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel; 