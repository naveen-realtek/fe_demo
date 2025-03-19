import React from 'react';
import { AdminRoutes } from '../routes';
import KnowledgePopup from '../components/knowledge-popup/knowledgepopup';
import { ConfigProvider } from 'antd';

function AdminLayout(props) {
    return (
        <>
            <div className='admin-layout ps-4' id='admin-layout'>
                <div className='d-flex'>
                    <div className='w-100 pe-4 '>
                        <AdminRoutes />
                    </div>
                    <div className='knowledge-sec flex-none'>
                        <KnowledgePopup />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;