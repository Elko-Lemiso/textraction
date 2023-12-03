import React, { useState, useEffect } from "react";
import { TextInput, Textarea, Button, Group, Box, DatePicker } from "@mantine/core";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

const ManualEntry = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [prescription, setPrescription] = useState({
    text: "",
    createdAt: new Date(),
    userUuid: user?.id || "",
  });


  useEffect(() => {
    // Update userUuid if user changes
    setPrescription((prev) => ({ ...prev, userUuid: user?.id || "" }));
  }, [user]);

  const handleChange = (e) => {
    setPrescription({ ...prescription, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([{
          text: prescription.text,
          created_at: new Date().toISOString(),
          user: user.id, // Make sure the field name matches your table's column name
        }]);

      if (error) throw error;

      console.log('Prescription added:', data);
      // Optionally reset form or give user feedback
    } catch (error) {
      console.error('Error submitting prescription:', error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <h2>Manual Entry</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          label="Prescription Text"
          name="text"
          value={prescription.text}
          onChange={handleChange}
          required
        />
        <Group position="right" mt="md">
          <Button type="submit ">Submit Prescription</Button>
        </Group>
      </form>
    </Box>
  );
};

export default ManualEntry;
