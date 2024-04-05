import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import FolderPage, { Folder, FolderPageProps, Link } from "../../src/folder";
import { axiosInstance } from "../../src/util/axiosInstance";
import { mapFolderData } from "../../src/util/mapFolderData";
import { mapFolderFromLink } from "../../src/util/mapFolderFromLink";

export const getStaticPaths = (async () => {
    const { data } = await axiosInstance.get<{ data: Folder[] }>("users/1/folders");

    const paths = data.data
        .map((folder) => folder.id.toString())
        .map((m) => ({ params: { folderId: [m] } }));

    // [
    //     { params: { folderId: [ '14' ] } },
    //     { params: { folderId: [ '24' ] } },
    //     { params: { folderId: [ '307' ] } },
    //     { params: { folderId: [ '433' ] } },
    //     { params: { folderId: [ '441' ] } },
    //     { params: { folderId: [ '457' ] } },
    //     { params: { folderId: [ '480' ] } },
    //     { params: { folderId: [ '513' ] } }
    //   ]

    return {
        paths,
        fallback: true, // false or "blocking"
    };
}) satisfies GetStaticPaths<any>;

export const getStaticProps = (async (context) => {
    if (context.params && context.params.folderId && context.params.folderId?.length > 1) {
        return {
            notFound: true,
        };
    }
    const folderId = context.params?.folderId?.[0];
    const apiPath = !!folderId ? `users/1/links?folderId=${folderId}` : "users/1/links";
    const { data } = await axiosInstance.get<{ data: Link[] }>(apiPath);
    const {
        data: { data: folders },
    } = await axiosInstance.get<{ data: Folder[] }>("users/1/folders");

    return {
        props: {
            links: mapFolderFromLink(data.data).data,
            folders,
        },
    };
}) satisfies GetStaticProps<any>;

export const OptionalCatch: NextPage<FolderPageProps> = (props) => {
    return <FolderPage {...props} />;
};

export default OptionalCatch;
