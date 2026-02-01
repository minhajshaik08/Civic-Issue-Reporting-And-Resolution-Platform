import React, { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { showToast } from "../../components/Toast";
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
      showToast("Please enter the location details.", "error");
      return;
    }
    onSubmit();
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotoFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    setPhotoFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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

          {/* ✅ FIXED MAP WRAPPER HEIGHT */}
          <div
            style={{
              border: "1px dashed #ced4da",
              borderRadius: "8px",
              overflow: "hidden",
              height: "350px", // ✅ MUST
              width: "100%",
            }}
          >
            <LocationMap position={mapPosition} setPosition={setMapPosition} />
          </div>

          <div
            style={{
              fontSize: "0.85rem",
              color: "#6c757d",
              marginTop: "6px",
            }}
          >
            Click on the map to mark the exact location.
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Photo *</Form.Label>

          {/* upload box */}
          <div
            style={{
              border: "1px dashed #28a745",
              borderRadius: "8px",
              padding: "10px 12px",
              backgroundColor: "#f8fff9",
              minHeight: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {/* left: instruction + selected files as chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                flex: 1,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  color: "#28a745",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                ⬆ Drag &amp; drop photos
              </span>
              <span
                style={{
                  color: "#6c757d",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                or click Choose Photos
              </span>

              {photoFiles &&
                photoFiles.length > 0 &&
                photoFiles.map((file, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      maxWidth: "180px",
                      padding: "2px 6px",
                      borderRadius: "999px",
                      backgroundColor: "#e6f9ec",
                      border: "1px solid #22c55e",
                      fontSize: "0.8rem",
                      color: "#14532d",
                      whiteSpace: "nowrap",
                    }}
                    title={file.name}
                  >
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "140px",
                      }}
                    >
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      style={{
                        marginLeft: "4px",
                        border: "none",
                        background: "transparent",
                        color: "#b91c1c",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>

            {/* right: hidden file input + button */}
            <div>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                style={{ display: "none" }}
                id="photoInput"
              />
              <Button
                variant="success"
                type="button"
                size="sm"
                onClick={() => document.getElementById("photoInput").click()}
              >
                Choose Photos
              </Button>
            </div>
          </div>
        </Form.Group>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" type="button" onClick={onPrev}>
            ← Previous
          </Button>
          <Button variant="success" type="button" onClick={handleSubmitClick}>
            Submit Report
          </Button>
        </div>
      </Form>
    </>
  );
}

export default Step3LocationPhoto;
