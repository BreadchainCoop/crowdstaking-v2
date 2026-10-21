import { Connector, useConnect, useDisconnect } from "wagmi";
import { useEffect, useMemo, useState } from "react";

const AUTOCONNECTED_CONNECTOR_IDS = ["safe"];

export function useAutoConnect(activeConnector: Connector | undefined) {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [safeConnectorConnected, setSafeConnectorConnected] = useState(false);

  const safeConnectorPresent = useMemo(
    () =>
      AUTOCONNECTED_CONNECTOR_IDS.some((connector) =>
        connectors.some((c) => c.id === connector && c.ready)
      ),
    [connectors]
  );

  useEffect(() => {
    AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
      const connectorInstance = connectors.find(
        (c) => c.id === connector && c.ready
      );

      if (connectorInstance && !activeConnector) {
        connect({ connector: connectorInstance });
        setSafeConnectorConnected(true);
      }
    });
  }, [connect, connectors, disconnect, activeConnector]);

  useEffect(() => {
    if (safeConnectorPresent && !safeConnectorConnected && activeConnector)
      disconnect();
  }, [
    safeConnectorPresent,
    safeConnectorConnected,
    activeConnector,
    disconnect,
  ]);

  return { isSafe: safeConnectorPresent, isConnected: safeConnectorConnected };
}
