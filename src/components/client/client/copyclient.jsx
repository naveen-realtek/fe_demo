import React, { useState, useEffect, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Menu,
  TreeSelect,
  Table,
  Modal,
  Select,
  Form,
  Switch,
  Pagination,
  Input,
  Tooltip,
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import { OverlayMenuDropdown } from "../../../shared-components/overlay-menu/overlay-menu";
import { TcsLogo, ZinRightArrow, ZinEditIcon, ZinSearch ,ZinClear} from "../../images";
import { clientdata } from "../../../pages/client/client-data";
import { ClientService } from "../../../service";
const { SHOW_PARENT } = TreeSelect;
import "./client.scss";

import axios from "axios";
import { AdminToolset } from "../../toolset/AdminToolset";
import { useNavigate, useSearchParams } from "react-router-dom";

function Client() {
  // --------------------------------------------------------------------------   add  -------------------------------------------------------------------------------//

  const [loading, setLoading] = useState(false);
  const [view, setView] = useState([]); // Stores table data
  const [allUsersData, setAllUsersData] = useState([]); // Store original data
  const [filteredData, setFilteredData] = useState([]); // Store searched data
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const onClickFilterSearchDisabled = false;
  const inputFocusElement = useRef();
  const [searchError, setSearchError] = useState("");


  const [clientView, setClientView] = useState([]);
  

  const [tableParamsSource, setTableParamsSource] = useState({
    pagination: {
      current: 1, // Default to page 1
      pageSize: 10, // Default rows per page
      total: 0, // Total records
    },
  });
  
  // -----------------------------------------------------------  view  --------------------------------------------------------------------------------------------//

  // Fetch Client data
const getClient = async (page = 1, limit = 10) => {
  setLoading(true);
  try {
    const offset = (page - 1) * limit;
    console.log("Fetching clients with params:", { offset, limit });

    const response = await ClientService.getClientview(offset, limit, "new");

    console.log("API Response:", response);

    if (response?.data) {
      setClientView(response.data.clients || []);
      setAllUsersData(response.data.clients);
      setFilteredData(response.data.clients);
      setTableParamsSource((prevParams) => ({
        ...prevParams,
        pagination: {
          ...prevParams.pagination,
          current: page,
          pageSize: limit,
          total: response.data.totalCount, // Set total count from API
        },
      }));
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
  } finally {
    setLoading(false);
  }
};





const handleTableChangeByClients = async (pagination) => {
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
    setclientView([]);
  }
  const response = await ClientService.getClientview(
"clientView",
    offset,
    pageSize,
    "new"
  );
  setLoading(false);

  setclientView(response.data.clients|| []);

};


  useEffect(() => {
    getClient();
  }, []);



  // Table Columns
  const columns = [
    {
      key: "1",
      dataIndex: "clientRefrenceId",
      title: "Client ID",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.clientRefrenceId.localeCompare(b.clientRefrenceId),
      render: (clientRefrenceId) => (
        <Tooltip title={clientRefrenceId || "N/A"}>
          <span>{clientRefrenceId || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "2",
      dataIndex: "clientName",
      title: "Client Name",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.clientName.localeCompare(b.clientName),
      render: (clientName) => (
        <Tooltip title={clientName || "N/A"}>
          <span>{clientName || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "3",
      dataIndex: "clientType",
      title: "Client Type",
      width: 180,
      ellipsis: true,
      sorter: (a, b) => a.clientType.localeCompare(b.clientType),
      render: (clientType) => (
        <Tooltip title={clientType || "N/A"}>
          <span>{clientType || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "4",
      dataIndex: "federalId",
      title: "Federal ID",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.federalId.localeCompare(b.federalId),
      render: (federalId) => (
        <Tooltip title={federalId || "N/A"}>
          <span>{federalId || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      key: "5",
      dataIndex: "websiteUrl",
      title: "Website",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => a.websiteUrl.localeCompare(b.websiteUrl),
      render: (websiteUrl) =>
        websiteUrl ? (
          <Tooltip title={websiteUrl}>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              {websiteUrl}
            </a>
          </Tooltip>
        ) : (
          "N/A"
        ),
    },
{
  key: "6",
  dataIndex: "status",
  title: "Status",
  fixed: "right",
  width: 80,
  align: "center",
  render: (status, record) => (
    <Tooltip title={status ? "Active" : "Inactive"}>
      <Switch
        checked={status}
        onChange={(checked) => handleStatusToggle(checked, record)}
        defaultChecked
      />
    </Tooltip>
  ),
}
,
{
  key: "7",
  title: "Action",
  fixed: "right",
  width: 80,
  render: (_id, record) => (
    <Tooltip title="Edit Client">
      <Button type="link" onClick={() => Editview(record)}>
        <ZinEditIcon />
      </Button>
    </Tooltip>
  ),
  className: "actioncolumn-sticky",
}

    
  ];





  // --------------------------------------------------------------------------   search -------------------------------------------------------------------//



    // Handle Search
    const handleSearch = (value) => {
      setSearchText(value);
  
      // Reset if input is empty
      if (!value.trim()) {
        setFilteredData(allUsersData);
        setSearchError("");
        return;
      }
  
      // Example: require a minimum of 3 characters for search
      if (value.trim().length < 3) {
        setSearchError(" Minimum 3 characters required");
        setFilteredData([]);
        return;
      } else {
        setSearchError(""); // Clear any previous error
      }
  
      // Filter data (case-insensitive search)
      const filtered = allUsersData.filter((client) =>
        client.clientName.toLowerCase().includes(value.toLowerCase())
      );
  
  
  
      setFilteredData(filtered);
    };
  
    
    
  // Clear Search
  const handleClearSearch = () => {
    setSearchText("");
    setFilteredData(allUsersData);
    setShowSearch(false);
  };
  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => inputFocusElement.current?.focus(), 100);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };







  // -------------------------------------------------------------------------  export -------------------------------------------------------------------//

  const [openExport, setOpenExport] = useState(false); //export modal show & hide
  const [value, setValue] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]); //multiselect field
  const [openInactivate, setOpenInactivate] = useState(false); //Inactivate modal show & hide

  const clientExport = () => {
    //export modalpopup
    setOpenExport(true);
  };

  const exporthandleOk = () => {
    //export ok button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenExport(false);
    }, 3000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setEnableList(true);
  };

  const inactivatethandleOk = () => {
    //Inactivate ok button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenInactivate(false);
      setischecked(false);
      notification.open({
        className: "company-information-toaster",
        message: "",
        description: "Successfully inactivated the client.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
        placement: "bottomLeft",
      });
    }, 3000);
  };

  const exporthandleCancel = () => {
    //export cancel button
    setOpenExport(false);
  };

  const inactivatehandleCancel = () => {
    //Inactivate cancel button
    setOpenInactivate(false);
  };

  const onChange = (newValue) => {
    console.log("onChange ", value);
    setValue(newValue);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const tProps = {
    treeData,
    value,
    onChange,
    expandedKeys,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Select Fields to Export",
    style: {
      width: "100%",
    },
  };

  const rowSelection = {
    selectedRowKeys: checkedList,

    selectedRowKeys,
    onChange: onSelectChange,
    onSelectAll: (selected, selectedRows, changeRows) => {
      const newIds = changeRows.map((record) => record._id);
      setEnableList((pre) => {
        const previousIds = Array.isArray(pre) ? pre : [];
        if (selected) {
          return [...previousIds, ...newIds];
        } else {
          return previousIds.filter((id) => !newIds.includes(id));
        }
      });
    },
    preserveSelectedRowKeys: true,
  };



  const getexport = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      console.log("Fetching clients with params:", { offset, limit });
  
      const response = await ClientService.getClientview(offset, limit, "new");
  
      console.log("API Response:", response);
  
      if (response?.data) {
        setClientView(response.data.clients || []);
        setAllUsersData(response.data.clients);
        setFilteredData(response.data.clients);
        setTableParamsSource((prevParams) => ({
          ...prevParams,
          pagination: {
            ...prevParams.pagination,
            current: page,
            pageSize: limit,
            total: response.data.totalCount, // Set total count from API
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // -----------------------------------------------------------   check box -----------------------------------------//

  const [enableList, setEnableList] = useState(false);
  const [checkedList, setCheckedList] = useState([]);

  const treeData = [
    {
      title: "All",
      value: "0-1",
      key: "0-1",
      children: [
        {
          title: "Location",
          value: "0-1-0",
        },
        {
          title: "Client Organization Name",
          value: "0-1-1",
        },
        {
          title: "Client ID",
          value: "0-1-2",
        },
      ],
    },
  ];

  // -----------------------------------------------------------------------------   Inactive ---------------------------------------------------------------//

  const [selectedClient, setSelectedClient] = useState(null);

  // Open the modal when switching off
  const handleStatusToggle = (checked, record) => {
    if (!checked) {
      setSelectedClient(record);
      setOpenInactivate(true);
    } else {
      console.log("Client activated:", record);
    }
  };


  const inactivateHandleOk = async () => {
    if (!selectedClient) return;
    setLoading(true);
    try {
      const result = await ClientService.Inactiveclient(selectedClient._id);
      console.log("Client Inactivated:", result);
 
    } catch (error) {
      console.error("Error inactivating client:", error);
    } finally {
      setLoading(false);
      setOpenInactivate(false);
      setSelectedClient(null);
    }
  };

  
  // Close modal
  const inactivateHandleCancel = () => {
    setOpenInactivate(false);
    setSelectedClient(null);
  };

  







// -----------------------------------------------------------------------------------  Edit ---------------------------------------------------------------------------//




const Editview = (Data) => {
  navigate(`/app/admin/clients/add?EditId=${Data._id}`, {
    state: { userDetails: Data, isEditMode: true },
  });
};


// -----------------------------------------------------------------------  pagination -----------------------------------------------------------//






  return (
    <>
      <div className="admin-breadcrums">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <Breadcrumb separator={<ZinRightArrow />}>
            <Breadcrumb.Item>
              <Link to="/app/dashboard">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/app/admin">Admin</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Clients</Breadcrumb.Item>
          </Breadcrumb>
          <div className="d-flex">
            <div className="search-toolset">
              <ZinSearch onClick={handleSearchClick} />
              <div className="purple-border"></div>
              <Input
                ref={inputFocusElement}
                placeholder="Search client name"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                suffix={
                  searchText.length > 1 ? (
                    <ZinClear
                    onClick={() => { handleClearSearch() }}
                    style={{ color: 'rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
                />
                  ) : null
                }
              />
               {searchError && <div className="search-error">{searchError}</div>}
            </div>

            <div className="toolbar ms-3 text-end">
              <Button
                type="primary"
                size="small"
                onClick={() => clientExport(true)}
              >
                Export
              </Button>
            </div>
            <div className="toolbar ms-3 text-end">
              <Button type="primary" size="small">
                <Link to="/app/admin/clients/add">Add</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="common-SpaceAdmin">
        <Table
          columns={columns}
          dataSource={filteredData} // Use filteredData instead of view
          // rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 1500, y: "calc(100vh -  346px)" }}
          pagination={tableParamsSource.pagination}
          onChange={handleTableChangeByClients}
        />
      </div>

      <>
        <Modal
          open={openExport}
          title="Export Jobs"
          onOk={exporthandleOk}
          centered
          onCancel={exporthandleCancel}
          footer={[
            <Button key="back" onClick={exporthandleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              // type="primary"
              loading={loading}
              onClick={exporthandleOk}
            >
              Export
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12">
              <Form layout="vertical">
                <Form.Item label="Format" className="mb-3">
                  <Select
                    size="large"
                    showSearch
                    placeholder="Select Format"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "1",
                        label: "Excel",
                      },
                      {
                        value: "2",
                        label: "JPEG",
                      },
                      {
                        value: "3",
                        label: "PDF",
                      },
                      {
                        value: "4",
                        label: "PDF",
                      },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Fields to export" className="mb-3">
                  <TreeSelect treeDefaultExpandAll {...tProps} />
                </Form.Item>
              </Form>
            </div>
          </div>
        </Modal>
      </>
      <>
        <Modal
          open={openInactivate}
          centered
          title="Inactivate a Client"
          onOk={inactivateHandleOk}
          onCancel={inactivateHandleCancel}
          footer={[
            <Button key="back" onClick={inactivateHandleCancel}>
              Cancel
            </Button>,
            <Button key="submit" loading={loading} onClick={inactivateHandleOk}>
              Inactivate
            </Button>,
          ]}
        >
          <div className="row">
            <div className="col-lg-12">
              <p>
                Are you sure you want to inactivate{" "}
                <b>{selectedClient?.name}</b> as a Client? Inactivating will not
                delete the data associated with the Client, but will not be
                accessible.
              </p>
            </div>
          </div>
        </Modal>
      </>
    </>
  );
}

export default Client;
