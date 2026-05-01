import { useState, useMemo } from 'react';

export function useReadiness() {
  const [formData, setFormData] = useState({
    age: false,
    id: false,
    registered: false,
  });

  const toggleField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const percentage = useMemo(() => {
    let score = 0;
    if (formData.age) score += 33;
    if (formData.id) score += 33;
    if (formData.registered) score += 34;
    return score;
  }, [formData]);

  const suggestions = useMemo(() => {
    const suggs = [];
    if (!formData.age) suggs.push("Check the minimum voting age in your state.");
    if (!formData.id) suggs.push("Gather acceptable ID documents for voting day.");
    if (!formData.registered) suggs.push("Complete your voter registration before the deadline.");
    return suggs;
  }, [formData]);

  return { formData, toggleField, percentage, suggestions };
}
