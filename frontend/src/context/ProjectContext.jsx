import React, { createContext, useState, useContext } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFilters, setProjectFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  const clearSelectedProject = () => setSelectedProject(null);

  const updateFilters = (newFilters) => {
    setProjectFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setProjectFilters({
      status: '',
      search: '',
      page: 1,
      limit: 10
    });
  };

  const value = {
    selectedProject,
    setSelectedProject,
    clearSelectedProject,
    projectFilters,
    updateFilters,
    resetFilters
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};