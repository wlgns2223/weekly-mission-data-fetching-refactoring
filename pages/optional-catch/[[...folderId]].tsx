import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import FolderPage, { Folder, FolderPageProps, Link } from "../../src/folder";
import { axiosInstance } from "../../src/util/axiosInstance";

// const params = {
//     folderId: [1]
// }

export const getServerSideProps = (async (context) => {
    if (context.params && context.params.folderId && context.params.folderId.length > 1) {
        return {
            notFound: true,
        };
    }

    // 전체폴더 http://localhost:3000/folder
    // 다른 폴더 http://localhost:3000/folder/11

    const folderId = context.params?.folderId?.[0];
    const apiPath = !!folderId ? `users/1/links?folderId=${folderId}` : "users/1/links";
    const { data } = await axiosInstance.get<{ data: Link[] }>(apiPath);
    const { data: folders } = await axiosInstance.get<{ data: Folder[] }>("users/1/folders");

    return {
        props: {
            links: data.data,
            folders: folders.data,
        },
    };
}) satisfies GetServerSideProps<any>;

export const OptionalCatch: NextPage<FolderPageProps> = (props) => {
    console.log(props.links);

    return <FolderPage {...props} />;
};

export default OptionalCatch;
