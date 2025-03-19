import React, { useEffect, useState } from "react";
import { Breadcrumb, Button } from "antd";
import { Link } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { TcsLogo, ZinRightArrow } from "../../images";
import { authorizationService, candidateService } from "../../../service";
import { CandidateService } from "../../../service/candidate-services";

function CompanyInformation() {
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [companyPhoto, setCompanyPhoto] = useState();
    const fetchCompanyInfo = async () => {
        try {
            setLoading(true);
            const data = await authorizationService.createcompany();

            if (data?.data) {
                const CompanyPhoto = await authorizationService.getCompanyPhotoView(data?.data.logo_copy_location)
                console.log("CompanyPhoto", CompanyPhoto.data);
                setCompanyPhoto(CompanyPhoto.data);
                setCompanyData(data.data);
            } else {
                setCompanyData(null); // No company exists yet
            }
        } catch (error) {
            console.error("Error fetching company info:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    return (
        <div>
            <div className="admin-breadcrums">
                <div className="w-100 d-flex align-items-center justify-content-between">
                    <Breadcrumb
                        className="breadcrum-dropdown"
                        separator={<ZinRightArrow />}
                    >
                        <Breadcrumb.Item>
                            <Link to="/app/dashboard">Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/app/admin">Admin</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            overlay={<OverlayMenuDropdown type="Organization settings" />}
                        >
                            <Link to="/app/admin/company-information">

                                Organization Settings
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Company information</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="toolbar text-end">
                        <Button type="primary" size="small">
                            <Link
                                to="/app/admin/company-information/edit"
                                state={{ companyData: companyData || {} }} // Pass empty object if no data
                            >
                                {companyData ? "Edit" : "Create"}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="common-SpaceAdmin">
                {loading ? (
                    <p>Loading company information...</p>
                ) : (
                    <div className="zn-admin-Card">
                        <div className="row g-0">
                            <div className="col-md-4 p-5 border-end">
                                <div className="d-flex justify-content-center">
                                    <div className="company-Logo mb-3">
                                        {companyData?.logo_copy_location ? (
                                            <img
                                                src={companyPhoto}
                                                alt="Company Logo"
                                                style={{
                                                    width: "150px",
                                                    height: "auto",
                                                    objectFit: "contain",
                                                }}
                                            // onError={(e) => (e.target.style.display = "none")}
                                            />
                                        ) : (
                                            "No Logo Available"
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="zn-fs-m zn-fw-700 mb-2">
                                        {(companyData && companyData?.company_name) ||
                                            "Company Name"}
                                    </div>
                                    <div className="zn-fs-s zn-light-text-dark02-color">
                                        {companyData?.address || "Company Address"}
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-8">
                                <div className="mt-3">
                                    <div className="p-4 border-bottom">
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <strong>Phone:</strong>{" "}
                                                {companyData?.phone_number || "N/A"}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Email:</strong> {companyData?.email || "N/A"}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Website:</strong>{" "}
                                                {companyData?.website || "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <strong>Timezone:</strong>{" "}
                                                {companyData?.time_zone || "N/A"}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Business Hours:</strong>{" "}
                                                {companyData?.businessHours || "N/A"}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Currency:</strong>{" "}
                                                {companyData?.currency || "N/A"}
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <strong>Date Format:</strong>{" "}
                                                {companyData?.date_format || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CompanyInformation;