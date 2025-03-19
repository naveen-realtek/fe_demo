// import React, { useEffect, useState } from "react";
// import {
//   Breadcrumb,
//   Button,
//   Menu,
//   TreeSelect,
//   Table,
//   notification,
//   Modal,
//   Select,
//   message,
//   Form,
//   Input,
//   Switch,
// } from "antd";
// import { Link } from "react-router-dom";
// import { candidatesourcesdata } from "../../../../pages/master/candidates/sources/data";
// import { OverlayMenuDropdown } from "../../../../shared-components/overlay-menu/overlay-menu";
// import SearchInput from "../../../../shared-components/search-input/search-input";
// import { masterService } from "../../../../service";
// import {
//   TcsLogo,
//   ZinRightArrow,
//   ZinEditIcon,
//   ZinDeleteIcon,
// } from "../../../images";
// import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

// export const CandidatesSources = () => {
//   const [loading, setLoading] = useState(false);
//   const [CandidatessourcesDT, setCandidatessourcesDT] =
//     useState(candidatesourcesdata);
//   const [openCandidatessourcesAdd, setOpenCandidatessourcesAdd] =
//     useState(false);
//   const [openCandidatessourcesEdit, setOpenCandidatessourcesEdit] =
//     useState(false);
//   const [Candidatessources, setCandidatessources] = useState("");
//   const [jobCandidatessourcesView, setJobCandidatessourcesView] = useState("");
//   const [CandidatessourcesEdit, setCandidatessourcesEdit] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const [candidatessourcesData, setCandidatessourcesData] = useState({
//     Name: "",
//     Status: true,
//     UniqueId: null,
//   });
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const showDeleteConfirm = (record) => {
//     console.log("Deleting record:", record);
//     setSelectedId(record.UniqueId); // Ensure UniqueId matches API requirements
//     setIsModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!selectedId) {
//       console.error("No ID selected for deletion.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call delete API
//       const result = await masterService.deleteMaster(
//         "candidateSources",
//         selectedId
//       );

//       if (result.status) {
//         message.success("Deleted successfully");

//         // Update UI after deletion
//         setCandidatessourcesDT((prevCandidatessources) =>
//           prevCandidatessources.filter(
//             (candidatessources) => candidatessources.UniqueId !== selectedId
//           )
//         );
//         getJobCandidatessourcesView();
//       } else {
//         message.error("Deletion failed");
//       }
//     } catch (error) {
//       console.error("Error deleting source:", error);
//       message.error("An error occurred while deleting");
//     } finally {
//       setLoading(false);
//       setIsModalOpen(false);
//       setSelectedId(null);
//     }
//   };

//   const [tableParamsCandidatessources, setTableParamsCandidatessources] =
//     useState({
//       pagination: {
//         current: 1,
//         showSizeChanger: false,
//       },
//     });
//   const handleTableChangeByCandidate = async (pagination) => {
//     const page = pagination.current - 1;
//     const pageSize = pagination.pageSize;
//     setTableParamsCandidatessources((prevParams) => ({
//       ...prevParams,
//       pagination: {
//         ...prevParams.pagination,
//         current: pagination.current,
//         pageSize: pageSize,
//       },
//     }));
//     const offset = page * pageSize;
//     if (pageSize !== tableParamsCandidatessources.pagination?.pageSize) {
//       setJobCandidatessourcesView([]);
//     }
//     const response = await masterService.getMasters(
//       "candidateSources",
//       offset,
//       pageSize,
//       "new"
//     );
//     setLoading(false);

//     setJobCandidatessourcesView(
//       response.data.MasterFeeds.map((item) => ({
//         key: item.UniqueId, // Ant Design requires a unique key
//         id: item.UniqueId, // Ensure ID is properly mapped
//         Name: item.Name,
//         Status: item.Status,
//       }))
//     );
//   };

//   const handleEditClick = (record) => {
//     setCandidatessourcesEdit(record);
//     setOpenCandidatessourcesEdit(true);
//   };

//   const handleCandidatessourcesEditSubmit = async () => {
//     console.log("CandidatessourcesEdit value is-->", CandidatessourcesEdit);
//     if (!CandidatessourcesEdit || !CandidatessourcesEdit.UniqueId) {
//       console.error(
//         "Invalid candidatessources edit data:",
//         CandidatessourcesEdit
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const editedCandidatessources = {
//         UniqueId: CandidatessourcesEdit.UniqueId,
//         Name: CandidatessourcesEdit.Name,
//         Status: CandidatessourcesEdit.Status,
//       };

//       const response = await masterService.EditMasters(
//         editedCandidatessources,
//         "candidateSources"
//       );
//       console.log("response.status", response);
//       if (response.status) {
//         getJobCandidatessourcesView();
//       }

//       setOpenCandidatessourcesEdit(false);
//       setCandidatessourcesEdit(null);
//     } catch (error) {
//       console.error(
//         "Error editing candidatessources:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const candidatessourcesSave = () => {
//     setOpenCandidatessourcesAdd(false);
//     setOpenCandidatessourcesEdit(false);
//   };

//   const candidatessourcesEdit = async () => {
//     if (!CandidatessourcesEdit || !CandidatessourcesEdit.id) {
//       console.error(
//         "Invalid candidatessources edit data:",
//         CandidatessourcesEdit
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const editedCandidatessources = {
//         UniqueId: CandidatessourcesEdit.id,
//         Name: CandidatessourcesEdit.Name,
//         Status: CandidatessourcesEdit.Status,
//       };

//       console.log("Updating candidatessources:", editedCandidatessources);

//       const response = await masterService.EditMasters(
//         editedCandidatessources,
//         "candidateSources"
//       );

//       console.log("Edit API Response:", response);

//       if (response?.data) {
//         setJobCandidatessourcesView((prevData) =>
//           prevData.map((item) =>
//             item.id === response.data.UniqueId
//               ? {
//                   ...item,
//                   candidatessources: response.data.Name,
//                   status: response.data.Status,
//                 }
//               : item
//           )
//         );
//       }

//       setOpenopenCandidatessourcesEdit(false);
//       setCandidatessourcesEdit("");
//     } catch (error) {
//       console.error(
//         "Error editing candidatessources:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const candidatessourcesOk = async () => {
//     if (!Candidatessources) return;

//     setLoading(true);

//     try {
//       const newCandidatessources = {
//         name: Candidatessources,
//         status: true,
//       };

//       const response = await masterService.addMasters(
//         "candidateSources",
//         newCandidatessources
//       );

//       if (response.status) {
//         await getJobCandidatessourcesView(); // ✅ Ensure fresh data is fetched
//       }

//       setOpenCandidatessourcesAdd(false);
//       setCandidatessources("");
//     } catch (error) {
//       console.error(
//         "Error adding candidatessources:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const [offset, setOffset] = useState(0);
//   const limit = 10;

//   const getJobCandidatessourcesView = async () => {
//     setLoading(true);
//     try {
//       const response = await masterService.getMasters(
//         "candidateSources",
//         offset,
//         limit,
//         "new"
//       );
//       console.log("API Response:", response); // Debugging

//       if (response?.data?.MasterFeeds) {
//         setJobCandidatessourcesView(response.data.MasterFeeds);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const candidatessourcesNameInput = (event) => {
//     setCandidatessources(event.target.value);
//   };

//   useEffect(() => {
//     if (!openCandidatessourcesAdd) {
//       getJobCandidatessourcesView();
//     }
//   }, [openCandidatessourcesAdd]);

//   const handleSortChange = (order) => {
//     setSortOrder(order);

//     // Ensure jobSourceView has data before sorting
//     if (!jobCandidatessourcesView || jobCandidatessourcesView.length === 0)
//       return;

//     const sortedData = [...jobCandidatessourcesView].sort((a, b) => {
//       if (order === "ascend") {
//         return a.Name.localeCompare(b.Name); // A → Z
//       } else if (order === "descend") {
//         return b.Name.localeCompare(a.Name); // Z → A
//       }
//       return 0;
//     });

//     setJobCandidatessourcesView(sortedData);
//   };

//   const successNotification = (placement, message) => {
//     notification.success({
//       message: "Success",
//       description: message,
//       placement, // e.g., "topRight", "bottomLeft"
//     });
//   };

//   const errorNotification = (placement, message) => {
//     notification.error({
//       message: "Error",
//       description: message,
//       placement, // e.g., "topRight", "bottomLeft"
//     });
//   };

//   const handleStatusToggle = async (checked, record) => {
//     console.log("record data is ------>", record);
//     console.log(
//       "Toggling Status for:",
//       record.UniqueId,
//       "New Status:",
//       checked
//     );

//     setLoading(true);
//     try {
//       const result = await masterService.updateMasterFeedStatus(
//         "candidateSources",
//         record.UniqueId,
//         checked
//       );
//       console.log(`Master feed status updated to ${checked}:`, result);
//       if (result.status) {
//         successNotification("bottomLeft", result.data);
//         getJobCandidatessourcesView();
//         setCandidatessourcesDT((prevData) =>
//           prevData.map((candidatessources) =>
//             candidatessources.uniqueId === record.uniqueId
//               ? { ...candidatessources, status: checked }
//               : candidatessources
//           )
//         );
//       } else {
//         errorNotification("bottomLeft", result.error);
//       }
//     } catch (error) {
//       console.error("Error updating master feed status:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       if (editMode) {
//         await masterService.EditMasters(
//           candidatessourcesData,
//           "candidateSources"
//         );
//       } else {
//         await masterService.addMasters("candidateSources", {
//           name: candidatessourcesData.Name,
//           status: candidatessourcesData.Status,
//         });
//       }
//       fetchJobCandidatessources();
//       setModalOpen(false);
//     } catch (error) {
//       console.error("Error saving source:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobCandidatessources();
//   }, []);

//   const fetchJobCandidatessources = async () => {
//     setLoading(true);
//     try {
//       const response = await masterService.getMasters(
//         "candidateSources",
//         0,
//         10,
//         "new"
//       );
//       setJobCandidatessourcesView(response.data.MasterFeeds || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (record = null) => {
//     if (record) {
//       setEditMode(true);
//       setCandidatessourcesData({ ...record });
//     } else {
//       setEditMode(false);
//       setCandidatessourcesData({ Name: "", Status: true, UniqueId: null });
//     }
//     setModalOpen(true);
//   };

//   const candidatessourcescolumns = [
//     {
//       key: "1",
//       dataIndex: "Name",
//       title: () => (
//         <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//           <span>Source</span>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               cursor: "pointer",
//             }}
//           >
//             <CaretUpOutlined
//               style={{
//                 color: sortOrder === "ascend" ? "blue" : "gray",
//                 fontSize: "12px",
//               }}
//               onClick={() => handleSortChange("ascend")}
//             />
//             <CaretDownOutlined
//               style={{
//                 color: sortOrder === "descend" ? "blue" : "gray",
//                 fontSize: "12px",
//               }}
//               onClick={() => handleSortChange("descend")}
//             />
//           </div>
//         </div>
//       ),
//       render: (_, record) => <div>{record.Name}</div>,
//     },
//     {
//       key: "2",
//       dataIndex: "status",
//       title: "Status",
//       fixed: "right",
//       width: 80,
//       align: "center",
//       render: (status, record) => (
//         <Switch
//           checked={record.Status}
//           onChange={(checked) => handleStatusToggle(checked, record)}
//         />
//       ),
//     },
//     {
//       key: "3",
//       dataIndex: "id",
//       title: "Action",
//       key: "action",
//       fixed: "right",
//       width: 120,

//       render: (_, record) => (
//         <div className="d-flex justify-content-center gap-4">
//           <ZinEditIcon
//             className="cursor-pointer"
//             onClick={() => handleOpenModal(record)}
//           />

//           <ZinDeleteIcon
//             className="cursor-pointer"
//             onClick={() => showDeleteConfirm(record)}
//           />
//         </div>
//       ),
//       align: "center",
//       className: "actioncolumn-sticky",
//     },
//   ];

//   return (
//     <>
//       <div className="admin-breadcrums">
//         <div className="d-flex w-100 justify-content-between align-items-center">
//           <Breadcrumb
//             className="breadcrum-dropdown"
//             separator={<ZinRightArrow />}
//           >
//             <Breadcrumb.Item>
//               <Link to="/app/dashboard">Home</Link>
//             </Breadcrumb.Item>
//             <Breadcrumb.Item>
//               <Link to="/app/admin">Admin</Link>
//             </Breadcrumb.Item>
//             <Breadcrumb.Item>Masters</Breadcrumb.Item>
//             <Breadcrumb.Item
//               overlay={<OverlayMenuDropdown type="Candidates" />}
//             >
//               Candidates
//             </Breadcrumb.Item>
//             <Breadcrumb.Item>Candidatessources</Breadcrumb.Item>
//           </Breadcrumb>
//           <div>
//             <div className="d-flex justify-content-end align-items-center">
//               <div className="toolbar ms-3 text-end ">
//                 <Button type="primary" onClick={() => handleOpenModal()}>
//                   Add
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="common-SpaceAdmin">
//         <Table
//           columns={candidatessourcescolumns}
//           dataSource={jobCandidatessourcesView} // ✅ Correct prop name
//           scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
//           loading={loading}
//           pagination={tableParamsCandidatessources.pagination}
//           onChange={handleTableChangeByCandidate}
//           rowKey="UniqueId"
//         />
//       </div>

//       <Modal
//         open={modalOpen}
//         title={editMode ? "Edit" : "Add"}
//         onCancel={() => setModalOpen(false)}
//         footer={[
//           <Button key="cancel" onClick={() => setModalOpen(false)}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={loading}
//             onClick={handleSave}
//           >
//             {editMode ? "Update" : "Save"}
//           </Button>,
//         ]}
//       >
//         <Form layout="vertical">
//           <Form.Item label="Name">
//             <Input
//               size="large"
//               value={candidatessourcesData.Name}
//               onChange={(e) =>
//                 setCandidatessourcesData({
//                   ...candidatessourcesData,
//                   Name: e.target.value,
//                 })
//               }
//             />
//           </Form.Item>
//           <Form.Item label="Status">
//             <Switch
//               checked={candidatessourcesData.Status}
//               onChange={(checked) =>
//                 setCandidatessourcesData({
//                   ...candidatessourcesData,
//                   Status: checked,
//                 })
//               }
//             />
//           </Form.Item>
//         </Form>
//       </Modal>



//       <Modal
//         centered
//         title="Delete"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         afterClose={() => {
//           setSelectedId(null);
//           document.activeElement?.blur(); // ✅ Remove focus from any element inside modal
//         }}
//         footer={[
//           <Button key="cancel" onClick={() => setIsModalOpen(false)}>
//             Cancel
//           </Button>,
//           <Button
//             key="delete"
//             type="primary"
//             loading={loading}
//             onClick={handleDelete}
//           >
//             Delete
//           </Button>,
//         ]}
//         destroyOnClose={true} // ✅ Ensures modal is removed when closed
//         maskClosable={false} // ✅ Prevents accidental modal close
//       >
//         <p>Are you sure you want to delete this Candidates Source?</p>
//       </Modal>
//     </>
//   );
// };




import {
  Breadcrumb,
  Button,
  Table,
  notification,
  Modal,
  Form,
  Input,
  Switch,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ZinRightArrow,
  ZinEditIcon,
  ZinDeleteIcon,
} from "../../../images";
import { OverlayMenuDropdown } from "../../../../shared-components/overlay-menu/overlay-menu";
import { masterService } from "../../../../service";

function CandidatesSources(props) {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [jobSourceView, setJobSourceView] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const limit = 10;

  const [tableParamsSource, setTableParamsSource] = useState({
    pagination: {
      current: 1,
      showSizeChanger: false,
    },
  });
  const getJobSourceView = async () => {
    setLoading(true);
    try {
      const response = await masterService.getMasters(
        "candidateSources",
        offset,
        limit,
        "new"
      );
      setJobSourceView(response.data.masterFeeds || []);
      setTableParamsSource({
        ...tableParamsSource,
        pagination: {
          ...tableParamsSource.pagination,
          total: response.data.totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getJobSourceView();
  }, []);

  const handleStatusToggle = async (checked, record) => {
    setLoading(true);
    try {
      const result = await masterService.updateMasterFeedStatus(
        "candidateSources",
        record.uniqueId,
        checked
      );
      if (result.status) {
        getJobSourceView();
      }
    } catch (error) {
      console.error("Error updating master feed status:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleTableChangeByCandidate = async (pagination) => {
    const page = pagination.current - 1;
    const pageSize = pagination.pageSize;
    setTableParamsSource((prevParams) => ({
      ...prevParams,
      pagination: {
        ...prevParams.pagination,
        current: pagination.current,
        pageSize: pageSize,
      },
    }));
    const offset = page * pageSize;
    if (pageSize !== tableParamsSource.pagination?.pageSize) {
      setJobSourceView([]);
    }
    const response = await masterService.getMasters(
      "candidateSources",
      offset,
      pageSize,
      "new"
    );
    setLoading(false);
    setJobSourceView(response.data.masterFeeds || []);
  };
  const sourcescolumns = [
    {
      key: "1",
      dataIndex: "name",
      title: "Sources",
      render: (_, record) => <div>{record.name}</div>,
    },
    {
      key: "6",
      dataIndex: "status",
      title: "Status",
      fixed: "right",
      width: 80,
      align: "center",
      render: (status, record) => (
        <Switch
          checked={record.status && record.status ? true : false}
          onChange={(checked) => handleStatusToggle(checked, record)}
        />
      )
    },

    {
      key: "3",
      dataIndex: "uniqueId",
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="d-flex justify-content-center gap-4">
          <ZinEditIcon
            className="cursor-pointer"
            onClick={() => handleOpenModal(record.uniqueId)}
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


  const handleSave = async (values) => {
    setLoading(true);
    try {
      if (editMode) {
        await masterService.EditMasters("candidateSources", {
          name: values && values?.name,
          status: values && values?.status,
          uniqueId: editData && editData.data.uniqueId
        });
      } else {
        await masterService.addMasters("candidateSources", {
          name: values && values?.name,
          status: isActive && isActive ? true : false
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving source:", error);
    } finally {
      setLoading(false);
    }
    getJobSourceView();
  };

  const handleOpenModal = async (record) => {
    if (record) {
      setEditMode(true);
      const data = await masterService.detailMaster("candidateSources", record);
      setEditData(data);
      form.setFieldsValue({
        name: data?.data?.name,
        status: data?.data?.status ?? false,
      });
      setIsActive(data?.data?.status === true);

    } else {
      setEditMode(false);
      setEditData(null);
      form.resetFields(); // Reset form for add mode
    }
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      message.warning("No item selected for deletion.");
      return;
    }

    setLoading(true);
    try {
      const result = await masterService.deleteMaster("candidateSources", selectedId);
      if (result?.status) {
        message.success("Deleted successfully");
        await getJobSourceView();
      } else {
        message.error("Deletion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting source:", error);
      message.error("An error occurred while deleting. Please try again later.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  const onChangeSwitch = (checked) => {
    setIsActive(checked);
    form.setFieldsValue({ status: checked }); // Update form field value
  };

  const showDeleteConfirm = (record) => {
    setSelectedId(record.uniqueId); // Ensure uniqueId matches API requirements
    setIsModalOpen(true);
  };
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
            <Breadcrumb.Item>Sources</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <div className="toolbar ms-3 text-end ">
                <Button type="primary" onClick={() => handleOpenModal()}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="common-SpaceAdmin">
        <Table
          columns={sourcescolumns}
          dataSource={jobSourceView}
          scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
          loading={loading}
          pagination={tableParamsSource.pagination}
          onChange={handleTableChangeByCandidate}
          rowKey="uniqueId"
        />
      </div>
      <></>
      <Modal
        open={modalOpen}
        title={editMode ? "Edit" : "Add"}
        onCancel={() => setModalOpen(false)}
        footer={
          <>
            <Button type='seconday' size='small'></Button>
            <Button type='primary' size='small'></Button>
          </>
        }
      >
        <Form
          layout="vertical"
          className="add-form"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          onFinish={handleSave}
          form={form}
        >
          <div className="row">
            <div className='col-lg-12'>
              <Form.Item
                name="name"
                label="Sources"
                rules={[
                  {
                    required: true,
                    message: "Mandatory field"
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter sources"
                />
              </Form.Item>
            </div>
            <div className='col-lg-12'>
              <Form.Item label="Status" name="status" className="pb-0">
                <Switch
                  checked={isActive}
                  onChange={onChangeSwitch}
                />
                <span className="ms-2">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </Form.Item>
            </div>
            <div className='on-submitaddClient'>
              <Button type='seconday' size='small' className='' onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="primary" size='small' htmlType="submit" className='ms-3'
              >
                {editMode ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        centered
        title="Delete"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        afterClose={() => {
          setSelectedId(null);
          document.activeElement?.blur(); // ✅ Remove focus from any element inside modal
        }}
        footer={<>
          <Button type='seconday' size='small'></Button>
          <Button type='primary' size='small'></Button>
        </>}
        destroyOnClose={true} // ✅ Ensures modal is removed when closed
        maskClosable={false} // ✅ Prevents accidental modal close
      >
        <div className="row">
          <p>Are you sure you want to delete this Sources?</p>
          <div className='on-submitaddClient'>
            <Button type='seconday' size='small' className='' onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" size='small' onClick={handleDelete} className='ms-3'
            >
             Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CandidatesSources;
