import React, { createContext, useState, useContext } from 'react';

const defaultDraft = {
  siteName: '',
  clientName: '',
  description: '',
  priority: 'Low',
  date: new Date(),
};

const SurveyContext = createContext(undefined);

export const SurveyProvider = ({ children }) => {
  const [draft, setDraft] = useState(defaultDraft);
  const [history, setHistory] = useState([]);
  const [clipboardData, setClipboardData] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'Dev Patel',
    photoUri: null,
  });

  const updateUserProfile = (data) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
  };

  const updateDraft = (data) => {
    setDraft((prev) => ({ ...prev, ...data }));
  };

  const resetDraft = () => {
    setDraft({ ...defaultDraft, date: new Date() });
  };

  const submitSurvey = () => {
    const newSurvey = {
      ...draft,
      id: Date.now().toString(),
      submittedAt: new Date(),
    };
    setHistory((prev) => [newSurvey, ...prev]);
    resetDraft();
  };

  const deleteSurvey = (id) => {
    setHistory((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SurveyContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
        history,
        submitSurvey,
        deleteSurvey,
        clipboardData,
        setClipboardData,
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};
