import React, { useMemo } from 'react';
import { Card, useTheme } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { IconSelection } from 'src/components/ItemControls/IconSelection/IconSelection';
import { NodeControls } from './NodeControls/NodeControls';
import { ProjectControls } from './ProjectControls/ProjectControls';

export const ItemControlsManager = () => {
  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });
  const theme = useTheme();

  const Controls = useMemo(() => {
    switch (itemControls?.type) {
      case 'SINGLE_NODE':
        return <NodeControls nodeId={itemControls.nodeId} />;
      case 'PROJECT_SETTINGS':
        return <ProjectControls />;
      case 'PLACE_ELEMENT':
        return <IconSelection />;
      default:
        return null;
    }
  }, [itemControls]);

  return (
    <Card
      sx={{
        position: 'absolute',
        width: '325px',
        maxHeight: `calc(100% - ${theme.customVars.appPadding.y * 2}px)`,
        left: theme.customVars.appPadding.x,
        top: theme.customVars.appPadding.y,
        borderRadius: 2
      }}
    >
      {Controls}
    </Card>
  );
};
