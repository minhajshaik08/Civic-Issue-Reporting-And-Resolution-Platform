import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import LocationMap from "./LocationMap";

function Step3LocationPhoto({
  locationText,
  setLocationText,
  photoFiles,
  setPhotoFiles,
  mapPosition,
  setMapPosition,
  onPrev,
  onSubmit,
}) {
  // when marker moves (click), fetch address and fill textarea
  useEffect(() => {
    const fetchAddress = async () => {
      if (!mapPosition) return;

      try {
        const { lat, lng } = mapPosition;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, {
          headers: { "User-Agent": "civic-report-demo" },
        });
        const data = await res.json();
        if (data && data.display_name) {
          const parts = data.display_name.split(",");
          const cleaned = parts[0].trim();
          const finalText = `${cleaned}, SPSR Nellore District, Andhra Pradesh`;
          setLocationText(finalText);
        }
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    };

    fetchAddress();
  }, [mapPosition, setLocationText]);

  const handleSubmitClick = () => {
    if (!locationText.trim()) {
      alert("Please enter the location details.");
      return;
    }

    // mapPosition and photos will be validated in parent (ReportIssuePage)
    onSubmit();
  };

  return (
    <>
      <h5 className="mb-3">Location &amp; Evidence</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Location Details *</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Enter the street address or nearest intersection"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />
          <Form.Text muted>
            This text is filled automatically from the map. Please correct the
            landmark if needed.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Pick Location on Map</Form.Label>
          <div
            style={{
              border: "1px dashed #ced4da",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <LocationMap
              position={mapPosition}
              setPosition={setMapPosition}
            />
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6c757d",
              marginTop: "4px",
            }}
          >
            Click on the map to mark the exact location.
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Photo *</Form.Label>
          <div
            style={{
              border: "1px dashed #28a745",
              borderRadius: "6px",
              padding: "32px 16px",
              textAlign: "center",
              backgroundColor: "#f8fff9",
            }}
          >
            <div className="mb-2" style={{ color: "#28a745" }}>
              ⬆ Drag &amp; Drop Photos Here
            </div>
            <div
              className="mb-3"
              style={{ fontSize: "0.9rem", color: "#6c757d" }}
            >
              or click the button below
            </div>

            <Form.Control
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotoFiles(Array.from(e.target.files))}
              style={{ display: "none" }}
              id="photoInput"
            />
            <Button
              variant="success"
              type="button"
              onClick={() =>
                document.getElementById("photoInput").click()
              }
            >
              Choose Photos
            </Button>

            {photoFiles && photoFiles.length > 0 && (
              <div className="mt-2" style={{ fontSize: "0.85rem" }}>
                Selected:
                <ul className="mb-0">
                  {photoFiles.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" type="button" onClick={onPrev}>
            ← Previous
          </Button>
          <Button
            variant="success"
            type="button"
            onClick={handleSubmitClick}
          >
            Submit Report
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Step3LocationPhoto;
