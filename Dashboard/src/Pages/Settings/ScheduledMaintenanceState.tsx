import Route from 'Common/Types/API/Route';
import Page from 'CommonUI/src/Components/Page/Page';
import React, { FunctionComponent, ReactElement } from 'react';
import PageMap from '../../Utils/PageMap';
import RouteMap from '../../Utils/RouteMap';
import PageComponentProps from '../PageComponentProps';
import DashboardSideMenu from './SideMenu';
import ModelTable, {
    ShowTableAs,
} from 'CommonUI/src/Components/ModelTable/ModelTable';
import ScheduledMaintenanceState from 'Model/Models/ScheduledMaintenanceState';
import FormFieldSchemaType from 'CommonUI/src/Components/Forms/Types/FormFieldSchemaType';
import { IconProp } from 'CommonUI/src/Components/Icon/Icon';
import FieldType from 'CommonUI/src/Components/Types/FieldType';
import { JSONObject } from 'Common/Types/JSON';
import Pill from 'CommonUI/src/Components/Pill/Pill';
import Color from 'Common/Types/Color';
import SortOrder from 'Common/Types/Database/SortOrder';
import BadDataException from 'Common/Types/Exception/BadDataException';

const ScheduledMaintenancesPage: FunctionComponent<PageComponentProps> = (
    props: PageComponentProps
): ReactElement => {
    return (
        <Page
            title={'Project Settings'}
            breadcrumbLinks={[
                {
                    title: 'Project',
                    to: RouteMap[PageMap.HOME] as Route,
                },
                {
                    title: 'Settings',
                    to: RouteMap[PageMap.SETTINGS] as Route,
                },
                {
                    title: 'Scheduled Maintenance State',
                    to: RouteMap[
                        PageMap.SETTINGS_SCHEDULED_MAINTENANCE_STATE
                    ] as Route,
                },
            ]}
            sideMenu={<DashboardSideMenu />}
        >
            <ModelTable<ScheduledMaintenanceState>
                modelType={ScheduledMaintenanceState}
                id="ScheduledMaintenance-state-table"
                isDeleteable={true}
                isEditable={true}
                isCreateable={true}
                cardProps={{
                    icon: IconProp.Clock,
                    title: 'Scheduled Maintenance State',
                    description:
                        'Scheduled Maintenance events have multiple states like - scheduled, ongoing and completed. You can more states help you manage Scheduled Maintenance events here.',
                }}
                sortBy="order"
                sortOrder={SortOrder.Ascending}
                onBeforeDelete={(item: ScheduledMaintenanceState) => {
                    if (item.isScheduledState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the scheduled state of for this project. Scheduled, Ongoing, Completed states cannot be deleted.'
                        );
                    }

                    if (item.isOngoingState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the scheduled state of for this project. Scheduled, Ongoing, Completed states cannot be deleted.'
                        );
                    }

                    if (item.isResolvedState) {
                        throw new BadDataException(
                            'This Scheduled Maintenance cannot be deleted because its the scheduled state of for this project. Scheduled, Ongoing, Completed states cannot be deleted.'
                        );
                    }

                    return item;
                }}
                selectMoreFields={{
                    color: true,
                    isScheduledState: true,
                    isOngoingState: true,
                    isResolvedState: true,
                    order: true,
                }}
                columns={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        type: FieldType.Text,
                        getElement: (item: JSONObject): ReactElement => {
                            return (
                                <Pill
                                    color={item['color'] as Color}
                                    text={item['name'] as string}
                                />
                            );
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        type: FieldType.Text,
                    },
                ]}
                noItemsMessage={'No Scheduled Maintenance state found.'}
                viewPageRoute={props.pageRoute}
                formFields={[
                    {
                        field: {
                            name: true,
                        },
                        title: 'Name',
                        fieldType: FormFieldSchemaType.Text,
                        required: true,
                        placeholder: 'Monitoring',
                        validation: {
                            minLength: 2,
                        },
                    },
                    {
                        field: {
                            description: true,
                        },
                        title: 'Description',
                        fieldType: FormFieldSchemaType.LongText,
                        required: true,
                        placeholder:
                            'This Scheduled Maintenance state happens when the event is been monitored',
                    },
                    {
                        field: {
                            color: true,
                        },
                        title: 'Color',
                        fieldType: FormFieldSchemaType.Color,
                        required: true,
                        placeholder:
                            'Please select color for this Scheduled Maintenance state.',
                    },
                ]}
                showRefreshButton={true}
                showTableAs={ShowTableAs.OrderedStatesList}
                orderedStatesListProps={{
                    titleField: 'name',
                    descriptionField: 'description',
                    orderField: 'order',
                    shouldAddItemInTheEnd: true,
                }}
            />
        </Page>
    );
};

export default ScheduledMaintenancesPage;