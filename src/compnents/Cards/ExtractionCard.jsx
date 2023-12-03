import { useState } from "react";
import styles from "../../styles/Home.module.css";
import { v4 as uuidv4 } from 'uuid';
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export default function ExtractionCard() {
  const [textractData, setTextractData] = useState(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.target.file.files[0]);

    const response = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setTextractData(data);
      const compiledText = compileText(data.lines); // Compile lines into a single string
      saveDataToSupabase(compiledText);
    } else {
      console.error("File upload failed");
    }
  };

  const compileText = (lines) => {
    return lines.join(' '); // Join lines into a single string, separated by spaces
  };

  const saveDataToSupabase = async (extractedText) => {
    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert([{
          uuid: uuidv4(),
          text: extractedText,
          created_at: new Date().toISOString(),
          user: user.id,
        }]);

      if (error) throw error;
      console.log("Prescription data saved to Supabase successfully");
    } catch (error) {
      console.error("Error saving prescription data to Supabase:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Prescription Text Extractor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Upload and Analyze
        </button>
      </form>
      <div className={styles.result}>
        {textractData && (
          <div>
            <h2>Extracted Data:</h2>
            <pre>{JSON.stringify(textractData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
