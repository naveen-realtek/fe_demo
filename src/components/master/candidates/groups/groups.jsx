// import React, { useEffect, useState } from "react";
// import {
//   Breadcrumb,
//   Button,
//   Table,
//   Modal,
//   Form,
//   Input,
//   Switch,
//   notification,
//   message,
// } from "antd";
// import { Link } from "react-router-dom";
// import { ZinDeleteIcon, ZinEditIcon, ZinRightArrow } from "../../../images";
// import { OverlayMenuDropdown } from "../../../../shared-components/overlay-menu/overlay-menu";
// import { masterService } from "../../../../service";
// import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

// export const CandidatesGroups = () => {
//   const [loading, setLoading] = useState(false);
//   const [openCandidatesgroupsAdd, setOpenCandidatesgroupsAdd] = useState(false);
//   const [openCandidatesgroupsEdit, setOpenCandidatesgroupsEdit] =
//     useState(false);
//   const [jobCandidatesgroupsView, setJobCandidatesgroupsView] = useState([]);
//   const [CandidatesgroupsEdit, setCandidatesgroupsEdit] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [sortOrder, setSortOrder] = useState(null);
//   const [form] = Form.useForm();
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   const showDeleteConfirm = (record) => {
//     console.log("Deleting record:", record);
//     setSelectedId(record.UniqueId);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!selectedId) {
//       console.error("No ID selected for deletion.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await masterService.deleteMaster(
//         "candidateGroup",
//         selectedId
//       );

//       if (result.status) {
//         message.success("Deleted successfully");
//         getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
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

//   const handleEditClick = (record) => {
//     setCandidatesgroupsEdit(record);
//     form.setFieldsValue({
//       Name: record.Name,
//       Description: record.Description,
//       Status: record.Status,
//     });
//     setOpenCandidatesgroupsEdit(true);
//   };

//   const handleCandidatesgroupsSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);

//       const payload = {
//         UniqueId: CandidatesgroupsEdit?.UniqueId,
//         Name: values.Name,
//         Description: values.Description,
//         Status: values.Status,
//       };

//       const response = await masterService.EditMasters(
//         payload,
//         "candidateGroup"
//       );

//       if (response.status) {
//         message.success("Updated successfully");
//         getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
//         setOpenCandidatesgroupsEdit(false);
//       } else {
//         message.error("Failed to update group");
//       }
//     } catch (error) {
//       console.error("Error updating group:", error);
//       message.error("An error occurred while updating the group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const candidatesgroupsAdd = () => {
//     form.resetFields();
//     setOpenCandidatesgroupsAdd(true);
//   };

//   const candidatesgroupsSave = () => {
//     setOpenCandidatesgroupsAdd(false);
//     setOpenCandidatesgroupsEdit(false);
//   };

//   const handleAddFormSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       setLoading(true);

//       const payload = {
//         Name: values.Name,
//         Description: values.Description,
//         Status: values.Status,
//       };

//       const response = await masterService.addMasters(
//         "candidateGroup",
//         payload
//       );

//       if (response.status) {
//         message.success("Added successfully");
//         getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
//         setOpenCandidatesgroupsAdd(false);
//         form.resetFields();
//       } else {
//         message.error("Failed to add group");
//       }
//     } catch (error) {
//       console.error("Error adding group:", error);
//       message.error("An error occurred while adding the group");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getJobCandidatesgroupsView = async (page = 1, pageSize = 10) => {
//     setLoading(true);
//     try {
//       const offset = (page - 1) * pageSize;
//       const response = await masterService.getMasters(
//         "candidateGroup",
//         offset,
//         pageSize,
//         "new"
//       );

//       if (response?.data?.MasterFeeds) {
//         setJobCandidatesgroupsView(
//           response.data.MasterFeeds.map((item) => ({
//             key: item.UniqueId,
//             UniqueId: item.UniqueId,
//             Name: item.Name,
//             Description: item.Description || "No description available",
//             Status: item.Status,
//           }))
//         );

//         setPagination({
//           ...pagination,
//           current: page,
//           pageSize: pageSize,
//           total: response.data.TotalCount || 0,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
//   }, []);

//   const handleTableChange = (pagination) => {
//     getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
//   };

//   const handleSortChange = (order) => {
//     setSortOrder(order);

//     if (!jobCandidatesgroupsView || jobCandidatesgroupsView.length === 0)
//       return;

//     const sortedData = [...jobCandidatesgroupsView].sort((a, b) => {
//       if (order === "ascend") {
//         return a.Name.localeCompare(b.Name);
//       } else if (order === "descend") {
//         return b.Name.localeCompare(a.Name);
//       }
//       return 0;
//     });

//     setJobCandidatesgroupsView(sortedData);
//   };

//   const handleStatusToggle = async (checked, record) => {
//     setLoading(true);
//     try {
//       const result = await masterService.updateMasterFeedStatus(
//         "candidateGroup",
//         record.UniqueId,
//         checked
//       );
//       console.log(`Master feed status updated to ${checked}:`, result);
//       if (result.status) {
//         notification.success({
//           message: "Success",
//           description: result.data,
//           placement: "bottomLeft",
//         });
//         getJobCandidatesgroupsView(pagination.current, pagination.pageSize);
//       } else {
//         notification.error({
//           message: "Error",
//           description: result.error,
//           placement: "bottomLeft",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating master feed status:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const candidatesgroupscolumns = [
//     {
//       key: "1",
//       dataIndex: "Name",
//       title: () => (
//         <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//           <span>Groups</span>
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
//       dataIndex: "Description",
//       title: "Description",
//       render: (_, record) => <div>{record.Description}</div>,
//     },
//     {
//       key: "3",
//       dataIndex: "Status",
//       title: "Status",
//       fixed: "right",
//       width: 80,
//       align: "center",
//       render: (_, record) => (
//         <Switch
//           checked={record.Status}
//           onChange={(checked) => handleStatusToggle(checked, record)}
//         />
//       ),
//     },
//     {
//       key: "4",
//       dataIndex: "id",
//       title: "Action",
//       key: "action",
//       fixed: "right",
//       width: 120,
//       render: (_, record) => (
//         <div className="d-flex justify-content-center gap-4">
//           <ZinEditIcon
//             className="cursor-pointer"
//             onClick={() => handleEditClick(record)}
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
//             <Breadcrumb.Item>Groups</Breadcrumb.Item>
//           </Breadcrumb>
//           <div>
//             <div className="d-flex justify-content-end align-items-center">
//               <div className="toolbar ms-3 text-end ">
//                 <Button
//                   type="primary"
//                   size="small"
//                   onClick={candidatesgroupsAdd}
//                 >
//                   Add
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="common-SpaceAdmin">
//         <Table
//           columns={candidatesgroupscolumns}
//           dataSource={jobCandidatesgroupsView}
//           loading={loading}
//           pagination={pagination}
//           onChange={handleTableChange}
//           scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
//         />
//       </div>

//       <Modal
//         open={openCandidatesgroupsAdd}
//         title="Add "
//         centered
//         onCancel={candidatesgroupsSave}
//         footer={null}
//       >
//         <Form form={form} layout="vertical" onFinish={handleAddFormSubmit}>
//           <Form.Item label="Name" name="Name">
//             <Input type="text" size="large" placeholder="Enter Group Name" />
//           </Form.Item>

//           <Form.Item label="Description" name="Description">
//             <Input.TextArea size="large" placeholder="Enter Description" />
//           </Form.Item>

//           <Form.Item label="Status" name="Status" valuePropName="checked">
//             <Switch defaultChecked />
//           </Form.Item>
//           <Form.Item
//             style={{
//               textAlign: "right",
//               marginBottom: "0px",
//             }}
//           >
//             <Button
//               key="cancel"
//               onClick={candidatesgroupsSave}
//               style={{
//                 margin: "10px",
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="primary"
//               key="submit"
//               htmlType="submit"
//               loading={loading}
//             >
//               Save
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         open={openCandidatesgroupsEdit}
//         title="Edit "
//         centered
//         onCancel={candidatesgroupsSave}
//         footer={[
//           <Button key="cancel" onClick={candidatesgroupsSave}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={loading}
//             onClick={handleCandidatesgroupsSubmit}
//           >
//             Update
//           </Button>,
//         ]}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleCandidatesgroupsSubmit}
//         >
//           <Form.Item label="Name" name="Name">
//             <Input type="text" size="large" placeholder="Enter Group Name" />
//           </Form.Item>

//           <Form.Item label="Description" name="Description">
//             <Input.TextArea size="large" placeholder="Enter Description" />
//           </Form.Item>

//           <Form.Item label="Status" name="Status" valuePropName="checked">
//             <Switch />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         centered
//         title="Delete "
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
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
//       >
//         <p>Are you sure you want to delete this group?</p>
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

function CandidatesGroups(props) {
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
        "candidateGroup",
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
        "candidateGroup",
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
      "candidateGroup",
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
      title: "Group",
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
        await masterService.EditMasters("candidateGroup", {
          name: values && values?.name,
          status: values && values?.status,
          uniqueId: editData && editData.data.uniqueId
        });
      } else {
        await masterService.addMasters("candidateGroup", {
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
      const data = await masterService.detailMaster("candidateGroup", record);
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
      const result = await masterService.deleteMaster("candidateGroup", selectedId);
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
            <Breadcrumb.Item>Groups</Breadcrumb.Item>
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
                label="Groups"
                rules={[
                  {
                    required: true,
                    message: "Mandatory field"
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter group"
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
          <p>Are you sure you want to delete this Group?</p>
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

export default CandidatesGroups;
