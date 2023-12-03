import React, { useState, useEffect } from 'react';
import { Table } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        let { data, error } = await supabase
          .from('prescriptions')
          .select(`
            text,
            created_at,
            user
          `);

        if (error) throw error;

        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error.message);
      }
    };

    fetchPrescriptions();
  }, [supabase]);

  const rows = prescriptions.map((prescription) => (
    <Table.Tr key={prescription.user.uuid}>
      <Table.Td>{prescription.text}</Table.Td>
      <Table.Td>{prescription.created_at}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Prescription Text</Table.Th>
          <Table.Th>Created At</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Caption>Prescription history records</Table.Caption>
    </Table>
  );
}

export default PrescriptionHistory;
