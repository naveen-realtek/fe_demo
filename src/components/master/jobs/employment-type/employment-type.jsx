// import {
//   Breadcrumb,
//   Button,
//   Menu,
//   TreeSelect,
//   Table,
//   Modal,
//   Select,
//   message,
//   notification,
//   Form,
//   Input,
//   Switch,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   TcsLogo,
//   ZinRightArrow,
//   ZinEditIcon,
//   ZinDeleteIcon,
// } from "../../../images";
// import { employmentypesdata } from "../../../../pages/master/jobs/employment-type/data";
// import { OverlayMenuDropdown } from "../../../../shared-components/overlay-menu/overlay-menu";
// import { masterService } from "../../../../service";
// import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

// function JobEmployementType(props) {
//   const [form] = Form.useForm();
//   const [isActive, setIsActive] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [EmployementtypeDT, setEmployementtypeDT] =
//     useState(employmentypesdata);
//   const [Employementtype, setEmployementtype] = useState("");
//   const [jobEmployementtypeView, setJobEmployementtypeView] = useState([]);
//   const [EmployementtypeEdit, setEmployementtypeEdit] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const [api, contextHolder] = notification.useNotification();
//   // const [employementtypeData, setEmployementtypeData] = useState({
//   //   Name: "",
//   //   Status: true,
//   //   UniqueId: null,
//   // });
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
//         "employmentTypes",
//         selectedId
//       );

//       if (result.status) {
//         message.success("Deleted successfully");

//         // Update UI after deletion
//         setEmployementtypeDT((prevEmployementtype) =>
//           prevEmployementtype.filter(
//             (employementtype) => employementtype.UniqueId !== selectedId
//           )
//         );
//         getJobEmployementtypeView();
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

//   const [tableParamsEmployementtype, setTableParamsEmployementtype] = useState({
//     pagination: {
//       current: 1,
//       showSizeChanger: false,
//     },
//   });

//   const handleTableChangeByCandidate = async (pagination) => {
//     const page = pagination.current - 1;
//     const pageSize = pagination.pageSize;
//     setTableParamsEmployementtype((prevParams) => ({
//       ...prevParams,
//       pagination: {
//         ...prevParams.pagination,
//         current: pagination.current,
//         pageSize: pageSize,
//       },
//     }));
//     const offset = page * pageSize;
//     if (pageSize !== tableParamsEmployementtype.pagination?.pageSize) {
//       setJobEmployementtypeView([]);
//     }
//     const response = await masterService.getMasters(
//       "employmentTypes",
//       offset,
//       pageSize,
//       "new"
//     );
//     setLoading(false);
//     setJobEmployementtypeView(response.data.MasterFeeds || []);
//   };

//   const [offset, setOffset] = useState(0);
//   const limit = 10;

//   const getJobEmployementtypeView = async () => {
//     setLoading(true);
//     try {
//       const response = await masterService.getMasters(
//         "employmentTypes",
//         offset,
//         limit,
//         "new"
//       );
//       console.log("API Response:", response);
//       setJobEmployementtypeView(response.data.MasterFeeds || []);
//       setTableParamsEmployementtype({
//         ...tableParamsEmployementtype,
//         pagination: {
//           ...tableParamsEmployementtype.pagination,
//           total: response.data.TotalCount,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getJobEmployementtypeView();
//   }, []);

//   useEffect(() => {
//   }, [jobEmployementtypeView]);

//   const handleSortChange = (order) => {
//     setSortOrder(order);

//     // Ensure jobSourceView has data before sorting
//     if (!jobEmployementtypeView || jobEmployementtypeView.length === 0) return;

//     const sortedData = [...jobEmployementtypeView].sort((a, b) => {
//       if (order === "ascend") {
//         return a.Name.localeCompare(b.Name); // A → Z
//       } else if (order === "descend") {
//         return b.Name.localeCompare(a.Name); // Z → A
//       }
//       return 0;
//     });

//     setJobEmployementtypeView(sortedData);
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
//         "employmentTypes",
//         record.UniqueId,
//         checked
//       );
//       console.log(`Master feed status updated to ${checked}:`, result);
//       if (result.status) {
//         getJobEmployementtypeView();
//         setEmployementtypeDT((prevData) =>
//           prevData.map((employementtype) =>
//             employementtype.uniqueId === record.uniqueId
//               ? { ...employementtype, status: checked }
//               : employementtype
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

//   const handleSave = async (values) => {
//     setLoading(true);
//     try {
//       if (editMode) {
//         await masterService.EditMasters(employementtypeData, "employmentTypes");
//       } else {
//         await masterService.addMasters("employmentTypes", {
//           name: values && values.employmentTypes,
//           status: values && values.status,
//         });
//       }
//       getJobEmployementtypeView();
//       setModalOpen(false);
//     } catch (error) {
//       console.error("Error saving source:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (record = null) => {
//     if (record) {
//       setEditMode(true);
//       // setEmployementtypeData({ ...record });
//     } else {
//       setEditMode(false);
//       // setEmployementtypeData({ Name: "", Status: true, UniqueId: null });
//     }
//     setModalOpen(true);
//   };

//   const employementtypecolumns = [
//     {
//       key: "1",
//       dataIndex: "Name",
//       title: () => (
//         <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//           <span>Employement type</span>
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
//     ,
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
//   const onChangeSwitch = (checked) => {
//     setIsActive(checked);
//     form.setFieldsValue({ status: checked }); // Update form field value
//   };
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
//             <Breadcrumb.Item overlay={<OverlayMenuDropdown type="Jobs" />}>
//               Jobs
//             </Breadcrumb.Item>
//             <Breadcrumb.Item>Employement type</Breadcrumb.Item>
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
//           columns={employementtypecolumns}
//           dataSource={jobEmployementtypeView}
//           scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
//           loading={loading}
//           pagination={tableParamsEmployementtype.pagination}
//           onChange={handleTableChangeByCandidate}
//         />
//       </div>

//       <Modal
//         open={modalOpen}
//         title={editMode ? "Edit employment type" : "Add employment type"}
//         onCancel={() => setModalOpen(false)}
//         footer={<>
//           <Button type='seconday' size='small'></Button>
//           <Button type='primary' size='small'></Button>
//         </>}
//       >
//         <Form
//           layout="vertical"
//           className="add-form"
//           autoCorrect="off"
//           autoCapitalize="off"
//           autoComplete="off"
//           onFinish={handleSave}
//           form={form}
//         >
//           <div className="row">
//             <div className='col-lg-12'>
//               <Form.Item
//                 label="Employment type"
//                 name="employmentTypes"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Mandatory field"
//                   },
//                 ]}
//               >
//                 <Input
//                   size="large"
//                   placeholder="Enter employment type"
//                 />
//               </Form.Item>
//             </div>
//             <div className='col-lg-12'>
//               <Form.Item
//                 label="Status"
//                 name="status"
//               >
//                 <Switch
//                   checked={isActive}
//                   onChange={onChangeSwitch}
//                 />
//                 <span className="status_ActiveInactive">{isActive ? "Active" : "Inactive"}</span>
//               </Form.Item>
//             </div>
//             <div className='on-submitaddClient'>
//               <Button type='seconday' size='small' className='' onClick={() => setModalOpen(false)}>
//                 Cancel
//               </Button>
//               <Button type="primary" size='small' htmlType="submit" className='ms-3'
//               >
//                 {editMode ? "Update" : "Save"}
//               </Button>
//             </div>
//           </div>
//         </Form>
//       </Modal>

//       <Modal
//         centered
//         title="Delete Employement type"
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
//         <p>Are you sure you want to delete this Employement type?</p>
//       </Modal>
//     </>
//   );
// }

// export default JobEmployementType;



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

function JobEmployementType(props) {
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
        "employmentTypes",
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
        "employmentTypes",
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
      "employmentTypes",
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
      title: "Employment types",
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
        await masterService.EditMasters("employmentTypes", {
          name: values && values?.name,
          status: values && values?.status,
          uniqueId: editData && editData.data.uniqueId
        });
      } else {
        await masterService.addMasters("employmentTypes", {
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
      const data = await masterService.detailMaster("employmentTypes", record);
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
      const result = await masterService.deleteMaster("employmentTypes", selectedId);
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
            <Breadcrumb.Item overlay={<OverlayMenuDropdown type="Jobs" />}>
              Jobs
            </Breadcrumb.Item>
            <Breadcrumb.Item>Employment types</Breadcrumb.Item>
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
                label="Employment types"
                rules={[
                  {
                    required: true,
                    message: "Mandatory field"
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter employment types"
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
          <p>Are you sure you want to delete this Employment types?</p>
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

export default JobEmployementType;

