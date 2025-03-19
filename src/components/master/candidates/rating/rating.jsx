

import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Menu,
  TreeSelect,
  Table,
  Modal,
  Select,
  Form,
  Input,
  Switch,
} from "antd";
import { Link } from "react-router-dom";
import { ZinDeleteIcon, ZinEditIcon, ZinRightArrow } from "../../../images";
import { OverlayMenuDropdown } from "../../../../shared-components/overlay-menu/overlay-menu";
import { candidateratingdata } from "../../../../pages/master/candidates/rating/data";
import { masterService } from "../../../../service";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
 


export const  CandidatesRating = () => {
    const [loading, setLoading] = useState(false);
    const [CandidatesratingDT, setCandidatesratingDT] = useState(candidateratingdata);
    const [openCandidatesratingAdd, setOpenCandidatesratingAdd] = useState(false);
    const [openCandidatesratingEdit, setOpenCandidatesratingEdit] = useState(false);
    const [Candidatesrating, setCandidatesrating] = useState("");
    const [jobCandidatesratingView, setJobCandidatesratingView] = useState([]);

    const [CandidatesratingEdit, setCandidatesratingEdit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [form] = Form.useForm(); // ✅ Bind the form properly

    const [tableParamsCandidatesrating, setTableParamsCandidatesrating] = useState({
      pagination: {
        current: 1,
        showSizeChanger: false,
      },
    });
    const handleTableChangeByCandidate = async (pagination) => {
      const page = pagination.current - 1;
      const pageSize = pagination.pageSize;
      setTableParamsCandidatesrating((prevParams) => ({
        ...prevParams,
        pagination: {
          ...prevParams.pagination,
          current: pagination.current,
          pageSize: pageSize,
        },
      }));
      const offset = page * pageSize;
      if (pageSize !== tableParamsCandidatesrating.pagination?.pageSize) {
        setJobCandidatesratingView([]);
      }
      const response = await masterService.getMasters(
        "candidateRating",
        offset,
        pageSize,
        "new"
      );
      setLoading(false);
  
      setJobCandidatesratingView(
        response.data.MasterFeeds.map((item) => ({
          key: item.UniqueId, // Ant Design requires a unique key
          id: item.UniqueId, // Ensure ID is properly mapped
          Name: item.Name,
          Status: item.Status,
        }))
      );
    };
      
       
      
    const handleEditClick = (record) => {
      setCandidatesratingEdit(record);
      setOpenCandidatesratingEdit(true);
    };
  
    const handleCandidatesratingSubmit = async () => {
      console.log("CandidatesratingEdit value is-->", CandidatesratingEdit);
      if (!CandidatesratingEdit || !CandidatesratingEdit.UniqueId) {
        console.error("Invalid candidatesrating edit data:", CandidatesratingEdit);
        return;
      }
  
      setLoading(true);
  
      try {
        const editedCandidatesrating = {
          UniqueId: CandidatesratingEdit.UniqueId,
          Name: CandidatesratingEdit.Name,
          Status: CandidatesratingEdit.Status,
        };
  
        const response = await masterService.EditMasters(
          editedCandidatesrating,
          "candidateRating"
        );
        console.log("response.status", response);
        if (response.status) {
          getJobCandidatesratingView();
        }
  
        setOpenCandidatesratingEdit(false);
        setCandidatesratingEdit(null);
      } catch (error) {
        console.error(
          "Error editing candidatesrating:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
  
    const showDeleteConfirm = (id) => {
      console.log(id);
      setSelectedId(id);
      setIsModalOpen(true);
    };
  
    const handleDelete = () => {
      if (selectedId === null) {
        console.error("No ID selected for deletion.");
        return;
      }
  
      setCandidatesratingDT((prevCandidatesrating) =>
        prevCandidatesrating.filter((candidatesrating) => candidatesrating.id !== selectedId)
      );
  
      console.log(`Deleted candidatesrating with ID: ${selectedId}`);
  
      setIsModalOpen(false);
      setSelectedId(null);
    };
  
    const candidatesratingAdd = () => {
      setOpenCandidatesratingAdd(true);
    };
  
    const candidatesratingSave = () => {
      setOpenCandidatesratingAdd(false);
      setOpenCandidatesratingEdit(false);
    };
  
    const candidatesratingEdit = async () => {
      if (!CandidatesratingEdit || !CandidatesratingEdit.id) {
        console.error("Invalid candidatesrating edit data:", CandidatesratingEdit);
        return;
      }
  
      setLoading(true);
  
      try {
        const editedCandidatesrating = {
          UniqueId: CandidatesratingEdit.id,
          Name: CandidatesratingEdit.Name,
          Status: CandidatesratingEdit.Status,
        };
  
        console.log("Updating candidatesrating:", editedCandidatesrating);
  
        const response = await masterService.EditMasters(
          editedCandidatesrating,
          "candidateRating"
        );
  
        console.log("Edit API Response:", response);
  
        if (response?.data) {
          setJobCandidatesratingView((prevData) =>
            prevData.map((item) =>
              item.id === response.data.UniqueId
                ? {
                    ...item,
                    
                    candidatesrating: response.data.Name,
                    status: response.data.Status,
                  }
                : item
            )
          );
        }
  
        setOpenopenCandidatesratingEdit(false);
        setCandidatesratingEdit("");
      } catch (error) {
        console.error(
          "Error editing candidatesrating:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
  
    const candidatesratingOk = async () => {
        try {
          const values = await form.validateFields();
      
          const newCandidatesrating = {
            name: values.name,
            status: values.status ?? true,
            ratings: values.ratings || [],
          };
      
          setLoading(true);
          const response = await masterService.addMasters("candidateRating", newCandidatesrating);
      
          if (response.status) {
            await getJobCandidatesratingView(); // ✅ Wait for updated data
          }
      
          setOpenCandidatesratingAdd(false);
          form.resetFields();
        } catch (error) {
          console.error("Error adding candidates rating:", error.response?.data || error.message);
        } finally {
          setLoading(false);
        }
      };
        
  
    const [offset, setOffset] = useState(0);
    const limit = 10;
  
  const getJobCandidatesratingView = async () => {
  setLoading(true);
  try {
    console.log("Fetching from:", `api/candidateRating?offset=${offset}&limit=${limit}&type=new`);
    
    const response = await masterService.getMasters(
      "candidateRating",
      offset,
      limit,
      "new"
    );

    if (response?.data?.MasterFeeds) {
      console.log("Updated Ratings:", response.data.MasterFeeds);
      setJobCandidatesratingView(response.data.MasterFeeds);
    }
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

      
  
    const candidatesratingNameInput = (event) => {
      setCandidatesrating(event.target.value);
    };
  
    useEffect(() => {
      if (!openCandidatesratingAdd) {
        getJobCandidatesratingView();
      }
    }, [openCandidatesratingAdd]);
  
    const handleStatusChange = (id, newStatus) => {
      console.log("Clicked ID:", id, "New Status:", newStatus);
  
      setJobCandidatesratingView((prevCandidatesrating) =>
        prevCandidatesrating.map((candidatesrating) =>
          candidatesrating.id === id
            ? { ...candidatesrating, status: newStatus }
            : Candidatesrating
        )
      );
    };
  
    const handleSortChange = (order) => {
      setSortOrder(order);
    
      // Ensure jobSourceView has data before sorting
      if (!jobCandidatesratingView || jobCandidatesratingView.length === 0) return;
    
      const sortedData = [...jobCandidatesratingView].sort((a, b) => {
        if (order === "ascend") {
          return a.Name.localeCompare(b.Name); // A → Z
        } else if (order === "descend") {
          return b.Name.localeCompare(a.Name); // Z → A
        }
        return 0;
      });
    
      setJobCandidatesratingView(sortedData);
    };
    
  
  
    const candidatesratingcolumns = [
      {
          key: "1",
          dataIndex: "name",
          title: () => (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span>Rating</span>
              <div style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                <CaretUpOutlined
                  style={{
                    color: sortOrder === "ascend" ? "blue" : "gray",
                    fontSize: "12px",
                  }}
                  onClick={() => handleSortChange("ascend")}
                />
                <CaretDownOutlined
                  style={{
                    color: sortOrder === "descend" ? "blue" : "gray",
                    fontSize: "12px",
                  }}
                  onClick={() => handleSortChange("descend")}
                />
              </div>
            </div>
          ),
          render: (_, record) => <div>{record.Name}</div>,
        },
        {
            key: '2',
            dataIndex: 'ratingscore',
            title: () => (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span>Score</span>
                  <div style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                    <CaretUpOutlined
                      style={{
                        color: sortOrder === "ascend" ? "blue" : "gray",
                        fontSize: "12px",
                      }}
                      onClick={() => handleSortChange("ascend")}
                    />
                    <CaretDownOutlined
                      style={{
                        color: sortOrder === "descend" ? "blue" : "gray",
                        fontSize: "12px",
                      }}
                      onClick={() => handleSortChange("descend")}
                    />
                  </div>
                </div>
              ),
              render: (_, record) => <div>{record.UniqueId}</div>,

              ellipsis: true,
        },
    
      {
        key: "4",
        dataIndex: "id",
        title: "Action",
        key: "action",
        fixed: "right",
        width: 120,
  
        render: (_, record) => (
          <div className="d-flex justify-content-center gap-4">
            <ZinEditIcon
              className="cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
            <ZinDeleteIcon
              className="cursor-pointer"
              onClick={() => showDeleteConfirm(record)}
            />
          </div>
        ),
        align: "center",
        className: "actioncolumn-sticky",
      },
    ];
  
    return (
      <>
        <div className="admin-breadcrums">
          <div className="d-flex w-100 justify-content-between align-items-center">
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
              <Breadcrumb.Item>Masters</Breadcrumb.Item>
              <Breadcrumb.Item
                overlay={<OverlayMenuDropdown type="Candidates" />}
              >
                Candidates
              </Breadcrumb.Item>
              <Breadcrumb.Item>Rating</Breadcrumb.Item>
            </Breadcrumb>
            <div>
              <div className="d-flex justify-content-end align-items-center">
                <div className="toolbar ms-3 text-end ">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => candidatesratingAdd(true)}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="common-SpaceAdmin">
          <Table
            columns={candidatesratingcolumns}
            dataSource={jobCandidatesratingView} // ✅ Correct prop name
            scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
            loading={loading}
            pagination={tableParamsCandidatesrating.pagination}
            onChange={handleTableChangeByCandidate}
             rowKey="id"
          />
        </div>
        <>
        <Modal
      open={openCandidatesratingAdd}
      title="Add Candidate Rating"
      centered
      onCancel={() => setOpenCandidatesratingAdd(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpenCandidatesratingAdd(false)}>
          Cancel
        </Button>,
        <Button key="submit" loading={loading} onClick={candidatesratingOk}>
          Save
        </Button>,
      ]}
    >
       <Form form={form} layout="vertical" className="mt-3 mb-3">
      <p>Edit your rating criteria so that the total score is 100.</p>

      {/* Dynamic Rating Fields */}
      <Form.List name="ratings">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div className="row" key={key}>
                <div className="col-lg-8">
                  <Form.Item
                    className="rating-form-item"
                    {...restField}
                    name={[name, "name"]}
                    rules={[{ required: true, message: "Missing criteria" }]}
                  >
                    <Input placeholder="Add rating criteria"   type="text"
                    value={Candidatesrating}
                    onChange={candidatesratingNameInput}
                    size="large"
                    />
                  </Form.Item>
                </div>
                <div className="col-lg-3">
                  <Form.Item
                    className="rating-form-item"
                    {...restField}
                    name={[name, "ratingscore"]}
                    rules={[{ required: true, message: "Missing score" }]}
                  >
                    <Input placeholder="Score" type="number" />
                  </Form.Item>
                </div>
                <div className="col-lg-1">
                  <DeleteOutlined
                    className="mt-2 cursor-pointer"
                    onClick={() => remove(name)}
                    style={{ color: "red" }}
                  />
                </div>
              </div>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div className="zn-fs-m zn-fw-500 rating-total-score">
        The total score is not 100!
      </div>

          </Form>
    </Modal>
           
        </>
  
        <Modal
          open={openCandidatesratingEdit}
          title="Edit Candidate rating"
          onCancel={() => setOpenCandidatesratingEdit(false)}
          footer={[
            <Button key="cancel" onClick={candidatesratingSave}>
              Cancel
            </Button>,
            <Button
              key="submit"
              loading={loading}
              onClick={handleCandidatesratingSubmit}
            >
              Update
            </Button>,
          ]}
        >
     <Form layout="vertical" className="mt-3 mb-3">
  <p>Edit your rating criteria so that the total score is 100.</p>

  {/* Candidatesrating Name Input */}
  {/* <Form.Item label="Rating name">
    <Input
      value={CandidatesratingEdit?.Name || ""}
      onChange={(e) =>
        setCandidatesratingEdit((prev) => ({
          ...prev,
          Name: e.target.value,
        }))
      }
    />
  </Form.Item> */}

 
  {/* Dynamic Rating Fields */}
  <Form.List name="ratings">
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <div className="row" key={key}>
            <div className="col-lg-8">
              <Form.Item
                className="rating-form-item"
                {...restField}
                name={[name, "criteria"]}
                rules={[{ required: true, message: "Missing criteria" }]}
              >
                <Input placeholder="Add rating criteria"
                    value={CandidatesratingEdit?.Name || ""}
                    onChange={(e) =>
                      setCandidatesratingEdit((prev) => ({
                        ...prev,
                        Name: e.target.value,
                      }))
                    } />
              </Form.Item>
            </div>
            <div className="col-lg-3">
              <Form.Item
                className="rating-form-item"
                {...restField}
                name={[name, "score"]}
                rules={[{ required: true, message: "Missing score" }]}
              >
                <Input placeholder="Score" type="number" />
              </Form.Item>
            </div>
            <div className="col-lg-1">
              <DeleteOutlined
                className="mt-2 cursor-pointer"
                onClick={() => remove(name)}
                style={{ color: "red" }}
              />
            </div>
          </div>
        ))}
        <Form.Item>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Add field
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>

  <div className="zn-fs-m zn-fw-500 rating-total-score">
    The total score is not 100!
  </div>
</Form>

        </Modal>
  
        <Modal
          title="Delete Candidate rating"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
            <Button key="delete" onClick={handleDelete}>
              Delete
            </Button>,
          ]}
        >
          <p>Are you sure you want to delete this Candidatesrating?</p>
        </Modal>
      </>
    );
  };
  