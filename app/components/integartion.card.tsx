import { ConnectorButton } from "@kolla/react-sdk";

interface Props {
  background_color?: string;
  connector_id?: string;
  display_name?: string;
  icon?: string;
  long_description?:string,
  short_description?:string,
  documentation_link?:string,
}
export const IntegrationCard = ({
  connector_id,
  display_name,
  long_description,
  icon,
}: Props) => {
  return (
    <div className="max-w-full h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {display_name}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
       {long_description}
      </p>
      {connector_id && (
        <ConnectorButton
          connectorID={connector_id}
          styleOverrides={{
            button: {
              justifyContent: "center",
              width: "100%",
            },
          }}
        />
      )}
    </div>
  );
};
