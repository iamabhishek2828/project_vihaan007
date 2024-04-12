import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function Service() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setErrorMessage(""); // Clear any previous error message when a new image is selected
  };

  const handleImageUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior (automatic upload)

    if (!selectedImage) {
      setErrorMessage("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const responseData = await response.json();
      const imagePath = responseData.file_name;

      setImagePath(imagePath);
      setSelectedImage(null); // Clear selected image state after successful upload
    } catch (error) {
      console.error(error);
      setErrorMessage("Error uploading image");
    }
  };

  return (
    <div className="d-flex p-2 justify-content-center align-items-center">
      <Card style={{ width: "18rem" }}>
        {imagePath && (
          <Card.Img
            variant="top"
            src={`http://127.0.0.1:5000/uploads/${imagePath}`}
          />
        )}
        <Form onSubmit={handleImageUpload}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Upload the photo for diagnostics</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Form.Group>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Service;
