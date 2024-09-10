import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTreasureHuntSettings = () => {
  const [settings, setSettings] = useState({
    description: '',
    shortDescription: '',
    link: '',
    correctCode: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/treasure-hunt-settings');
        setSettings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching treasure hunt settings:', error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (settings._id) {
        await axios.put(`/api/treasure-hunt-settings/${settings._id}`, settings);
      } else {
        await axios.post('/api/treasure-hunt-settings', settings);
      }
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="description" value={settings.description} onChange={handleChange} placeholder="Description" required />
      <input name="shortDescription" value={settings.shortDescription} onChange={handleChange} placeholder="Short Description" required />
      <input name="link" value={settings.link} onChange={handleChange} placeholder="Link" required />
      <input name="correctCode" value={settings.correctCode} onChange={handleChange} placeholder="Correct Code" required />
      <input name="startTime" type="datetime-local" value={settings.startTime} onChange={handleChange} required />
      <input name="endTime" type="datetime-local" value={settings.endTime} onChange={handleChange} required />
      <button type="submit">Save Settings</button>
    </form>
  );
};

export default AdminTreasureHuntSettings;
