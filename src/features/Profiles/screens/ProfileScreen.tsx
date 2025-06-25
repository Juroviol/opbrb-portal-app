import {
  Breadcrumb,
  Button,
  Empty,
  Flex,
  notification,
  Spin,
  Table,
} from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_PROFILE, GET_PROFILES } from '@querys/profileQuery.ts';
import Profile from '@models/Profile.ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  PlusCircleFilled,
  TeamOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext.tsx';
import { Scope } from '@models/User.ts';
import AssignProfilePastorsModal from '@features/Profiles/components/AssignProfilePastorsModal.tsx';

export default function ProfileScreen() {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [profileIdToAssignToPastors, setProfileIdToAssignToPastors] =
    useState<string>();
  const deletingProfileIdRef = useRef<string>();
  const [size, setSize] = useState(15);
  const [deleteProfile, deleteProfileMutation] = useMutation<{
    deleteProfile: boolean;
  }>(DELETE_PROFILE);
  const getProfilesQuery = useQuery<{
    profiles: { total: number; docs: Profile[] };
  }>(GET_PROFILES, {
    variables: {
      page: currentPage,
      size,
    },
  });

  useEffect(() => {
    if (location.state?.refresh) getProfilesQuery.refetch();
  }, [location.state?.refresh]);

  const handleOnPaginationChange = useCallback((page: number, size: number) => {
    setCurrentPage(page);
    setSize(size);
  }, []);

  const handleNewProfile = useCallback(() => {
    navigate('/perfis/novo');
  }, []);

  const handleOnEdit = useCallback((id: string) => {
    navigate(`/perfis/${id}`);
  }, []);

  const handleOnDelete = useCallback(async (id: string) => {
    deletingProfileIdRef.current = id;
    await deleteProfile({ variables: { _id: id } });
    notification.success({
      message: 'Perfil excluído com sucesso!',
    });
    deletingProfileIdRef.current = undefined;
    getProfilesQuery.refetch();
  }, []);

  return (
    <>
      <Flex vertical gap={30}>
        <Flex justify="space-between">
          <Breadcrumb
            items={[
              { title: 'Home' },
              {
                title: 'Perfis',
              },
            ]}
          />
          {hasPermission(Scope.CanCreateProfileScopes) && (
            <Button
              icon={<PlusCircleFilled />}
              type="primary"
              onClick={handleNewProfile}
            >
              Novo Perfil
            </Button>
          )}
        </Flex>
        <Table
          dataSource={getProfilesQuery.data?.profiles.docs}
          pagination={{
            total: getProfilesQuery.data?.profiles.total,
            onChange: handleOnPaginationChange,
            pageSize: size,
            current: currentPage,
          }}
          loading={
            !!getProfilesQuery.data?.profiles.docs.length &&
            getProfilesQuery.loading
          }
          locale={{
            emptyText: getProfilesQuery.loading ? (
              <Flex justify="center">
                <Spin />
              </Flex>
            ) : (
              <Empty description="Sem dados" />
            ),
          }}
          columns={[
            {
              title: 'Nome',
              dataIndex: 'name',
            },
            ...(hasPermission(Scope.CanEditProfileScopes) ||
            hasPermission(Scope.CanDeleteProfileScopes)
              ? [
                  {
                    title: '',
                    dataIndex: '_id',
                    width: 50,
                    render(_id: string) {
                      return (
                        <Flex gap={5}>
                          {hasPermission(Scope.CanAssignProfileScopes) && (
                            <Button
                              icon={<TeamOutlined />}
                              onClick={() => setProfileIdToAssignToPastors(_id)}
                            />
                          )}
                          {hasPermission(Scope.CanEditProfileScopes) && (
                            <Button
                              disabled={
                                deletingProfileIdRef.current === _id &&
                                deleteProfileMutation.loading
                              }
                              icon={<EditFilled />}
                              onClick={() => handleOnEdit(_id)}
                            />
                          )}
                          {hasPermission(Scope.CanDeleteProfileScopes) && (
                            <Button
                              loading={
                                deletingProfileIdRef.current === _id &&
                                deleteProfileMutation.loading
                              }
                              disabled={
                                deletingProfileIdRef.current === _id &&
                                deleteProfileMutation.loading
                              }
                              icon={<DeleteFilled />}
                              color="danger"
                              variant="solid"
                              onClick={() => handleOnDelete(_id)}
                            />
                          )}
                        </Flex>
                      );
                    },
                  },
                ]
              : []),
          ]}
        />
      </Flex>
      {!!profileIdToAssignToPastors && (
        <AssignProfilePastorsModal
          profileId={profileIdToAssignToPastors}
          onClose={() => setProfileIdToAssignToPastors(undefined)}
        />
      )}
    </>
  );
}
