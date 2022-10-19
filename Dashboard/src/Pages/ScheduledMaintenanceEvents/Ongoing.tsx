import Page from 'CommonUI/src/Components/Page/Page';
import React, { FunctionComponent, ReactElement } from 'react';
import PageComponentProps from '../PageComponentProps';
import RouteMap from '../../Utils/RouteMap';
import PageMap from '../../Utils/PageMap';
import Route from 'Common/Types/API/Route';
import ScheduledMaintenanceTable from '../../Components/ScheduledMaintenance/ScheduledMaintenanceTable';
import SideMenu from './SideMenu';

const ScheduledMaintenancesPage: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    return (
        <Page
            title={'Scheduled Maintenance Events'}
            sideMenu={<SideMenu project={props.currentProject || undefined} />}
            breadcrumbLinks={[
                {
                    title: 'Project',
                    to: RouteMap[PageMap.HOME] as Route,
                },
                {
                    title: 'Scheduled Maintenance Events',
                    to: RouteMap[PageMap.SCHEDULED_MAINTENANCE_EVENTS] as Route,
                },
                {
                    title: 'Ongoing Scheduled Maintenance',
                    to: RouteMap[PageMap.ONGOING_SCHEDULED_MAINTENANCE_EVENTS] as Route,
                },
            ]}
        >
            <ScheduledMaintenanceTable
                currentProject={props.currentProject || undefined}
                viewPageRoute={RouteMap[PageMap.SCHEDULED_MAINTENANCE_EVENTS] as Route}
                query={{
                    projectId: props.currentProject?._id,
                    currentScheduledMaintenanceState: {
                        isOngoingState: true,
                    },
                }}
                noItemsMessage="No ongoing events so far."
                title="Ongoing Scheduled Maintenances"
                description="Here is a list of all the ongoing events for this project."
            />
        </Page>
    );
};

export default ScheduledMaintenancesPage;
