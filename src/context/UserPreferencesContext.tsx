'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Preferences = {
  language: string;
  currency: string;
};

interface UserPreferencesContextType {
  preferences: Preferences;
  setPreferences: (newPreferences: Partial<Preferences>) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const initialPreferences: Preferences = {
  language: 'en-US',
  currency: 'USD',
};

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferencesState] = useState<Preferences>(initialPreferences);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem('global-stay-preferences');
      if (storedPrefs) {
        setPreferencesState(JSON.parse(storedPrefs));
      }
    } catch (error) {
      console.error('Could not read user preferences from localStorage', error);
    }
  }, []);

  const setPreferences = (newPreferences: Partial<Preferences>) => {
    setPreferencesState((prev) => {
      const updatedPrefs = { ...prev, ...newPreferences };
      try {
        localStorage.setItem('global-stay-preferences', JSON.stringify(updatedPrefs));
      } catch (error) {
        console.error('Could not save user preferences to localStorage', error);
      }
      return updatedPrefs;
    });
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, setPreferences, isEditing, setIsEditing }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
