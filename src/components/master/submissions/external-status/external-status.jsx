import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Table,
  Modal,
  Select,
  Form,
  Input,
  Switch,
  Tag,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { ZinDeleteIcon, ZinEditIcon, ZinRightArrow } from "../../../images";
import { masterService } from "../../../../service";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";

export const SubmissionsExternalStatusTab = () => {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [openSubmissionsclientAdd, setOpenSubmissionsclientAdd] = useState(false);
  const [jobSubmissionsclientView, setJobSubmissionsclientView] = useState([]);
  const [SubmissionsclientEdit, setSubmissionsclientEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [form] = Form.useForm();

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: false,
    },
  });

  const showDeleteConfirm = (record) => {
    setSelectedId(record.uniqueId);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      console.error("No ID selected for deletion.");
      return;
    }

    setLoading(true);
    try {
      const result = await masterService.deleteMaster(
        "clientSubmission",
        selectedId
      );

      if (result.status) {
        message.success("Deleted successfully");
        getJobSubmissionsclientView();
      } else {
        message.error("Deletion failed");
      }
    } catch (error) {
      console.error("Error deleting source:", error);
      message.error("An error occurred while deleting");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  const [editData, setEditData] = useState(null);

  const handleEditClick = async (record) => {
    if (record) {
      setEditMode(true);
      const data = await masterService.detailMaster("clientSubmission", record.uniqueId);
      setEditData(data);
      form.setFieldsValue({
        name: data?.data?.name,
        type: data?.data?.type,
        status: data?.data?.status ?? false,
      });
      setIsActive(data?.data?.status === true);
    } else {
      setEditMode(false);
      setEditData(null);
      form.resetFields(); // Reset form for add mode
    }
    setOpenSubmissionsclientAdd(true);
  };

  const submissionsclientAdd = () => {
    form.resetFields();
    setEditMode(false);
    setOpenSubmissionsclientAdd(true);
  };

  const submissionsclientSave = () => {
    setOpenSubmissionsclientAdd(false);
  };

  const handleAddFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (editMode) {
        await masterService.EditMasters("clientSubmission", {
          name: values.name,
          status: values.status,
          type: values.type,
          uniqueId: editData?.data?.uniqueId
        });
      } else {
        await masterService.addMasters("clientSubmission", {
          name: values.name,
          type: values.type,
          status: values.status
        });
      }
      setOpenSubmissionsclientAdd(false);
      getJobSubmissionsclientView();
    } catch (error) {
      console.error("Error saving source:", error);
    } finally {
      setLoading(false);
    }
  };

  const getJobSubmissionsclientView = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const response = await masterService.getMasters(
        "clientSubmission",
        offset,
        pageSize,
        "new"
      );

      console.log("API Response:", response);
      if (response?.data?.masterFeeds) {
        setJobSubmissionsclientView(response.data.masterFeeds);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: response.data.TotalCount,
            current: page,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobSubmissionsclientView();
  }, []);

  const handleTableChange = (pagination) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: pagination.current,
      },
    });
    getJobSubmissionsclientView(pagination.current, pagination.pageSize);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);

    if (!jobSubmissionsclientView || jobSubmissionsclientView.length === 0)
      return;

    const sortedData = [...jobSubmissionsclientView].sort((a, b) => {
      if (order === "ascend") {
        return a.Name.localeCompare(b.Name);
      } else if (order === "descend") {
        return b.Name.localeCompare(a.Name);
      }
      return 0;
    });

    setJobSubmissionsclientView(sortedData);
  };

  const handleStatusToggle = async (checked, record) => {
    setLoading(true);
    try {
      const result = await masterService.updateMasterFeedStatus(
        "clientSubmission",
        record.uniqueId,
        checked
      );
      if (result.status) {
        getJobSubmissionsclientView();
      }
    } catch (error) {
      console.error("Error updating master feed status:", error);
    } finally {
      setLoading(false);
    }
  };

  const submissionsclientcolumns = [
    {
      key: "1",
      dataIndex: "name",
      title: "Name",
      width: 200,
      render: (_, record) => <div>{record.name}</div>,
    },
    {
      key: "2",
      dataIndex: "type",
      title: "Type",
      render: (_, record) => (
        <div>
          {record.type === "Positive" && <Tag color="green">Positive</Tag>}
          {record.type === "Neutral" && <Tag color="blue">Neutral</Tag>}
          {record.type === "Negative" && <Tag color="red">Negative</Tag>}
        </div>
      ),
    },
    {
      key: "3",
      dataIndex: "status",
      title: "Status",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.status && record.status ? true : false}
          onChange={(checked) => handleStatusToggle(checked, record)}
        />
      ),
    },
    {
      key: "4",
      dataIndex: "uniqueId",
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

  const onChangeSwitch = (checked) => {
    setIsActive(checked);
    form.setFieldsValue({ status: checked }); // Update form field value
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
            <Breadcrumb.Item>Submissions</Breadcrumb.Item>
            <Breadcrumb.Item>Status</Breadcrumb.Item>
          </Breadcrumb>
          <div>
            <div className="d-flex justify-content-end align-items-center">
              <div className="toolbar ms-3 text-end ">
                <Button
                  type="primary"
                  size="small"
                  onClick={submissionsclientAdd}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="common-SpaceAdmin mt-4">
        <Table
          columns={submissionsclientcolumns}
          dataSource={jobSubmissionsclientView}
          scroll={{ x: 600, y: "calc(100vh -  280px)", overflow: "overlay" }}
          loading={loading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          rowKey="uniqueId"
        />
      </div>

      <Modal
        open={openSubmissionsclientAdd}
        title={editMode ? "Edit" : "Add"}
        centered
        onCancel={submissionsclientSave}
        footer={[
      <>
                           <Button type='seconday' size='small'></Button>
                           <Button type='primary' size='small'></Button>
                         </>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          className="add-form"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          onFinish={handleAddFormSubmit}
        >
          <div className="row">
            <div className="col-lg-12">
              <Form.Item label="Type" name="type">
                <Select
                  size="large"
                  showSearch
                  placeholder="Select status type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    { value: "Positive", label: "Positive" },
                    { value: "Neutral", label: "Neutral" },
                    { value: "Negative", label: "Negative" },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="col-lg-12">
              <Form.Item label="Name" name="name">
                <Input type="text" size="large" placeholder="Enter status" />
              </Form.Item>
            </div>
            <div className="col-lg-12">
              <Form.Item label="Status" name="status" valuePropName="checked">
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
                        <Button key="back" onClick={submissionsclientSave}>
              Cancel
            </Button>
            <Button key="submit" type='primary' className='ms-3' loading={loading} onClick={() => form.submit()}>
              {editMode ? "Update" : "Add"}
            </Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        centered
        title="Delete "
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type='primary' className='ms-3' onClick={handleDelete}>
            Delete
          </Button>,
        ]}
      >
        <div className="row">
          <p>Are you sure you want to delete this client submission status?</p>
        </div>
      </Modal>
    </>
  );
};