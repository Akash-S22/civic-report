import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateIssue() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [severity, setSeverity] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [photo, setPhoto] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("severity", severity);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("photo", photo);

            const response = await api.post(
                "/issues",
                formData
            );

            console.log(response.data);

            navigate(`/issues/${response.data.issue._id}`);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create issue"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Report an Issue</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select category
                        </option>

                        <option value="garbage">
                            Garbage
                        </option>

                        <option value="pothole">
                            Pothole
                        </option>

                        <option value="streetlight">
                            Streetlight
                        </option>

                        <option value="drainage">
                            Drainage
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>
                </div>

                <div>
                    <label>Severity</label>

                    <select
                        value={severity}
                        onChange={(event) =>
                            setSeverity(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select severity
                        </option>

                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>
                </div>

                <div>
                    <label>Latitude</label>

                    <input
                        type="number"
                        step="any"
                        value={latitude}
                        onChange={(event) =>
                            setLatitude(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Longitude</label>

                    <input
                        type="number"
                        step="any"
                        value={longitude}
                        onChange={(event) =>
                            setLongitude(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Photo</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setPhoto(event.target.files[0])
                        }
                        required
                    />
                </div>

                {error && (
                    <p>{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting..."
                        : "Report Issue"}
                </button>
            </form>
        </div>
    );
}

export default CreateIssue;