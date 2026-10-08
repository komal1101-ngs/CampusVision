import { Request, Response } from 'express';
import { dbRepository } from '../services/dbService';

export const getHierarchy = async (req: Request, res: Response) => {
  try {
    const hierarchy = await dbRepository.getLocationsHierarchy();
    res.json(hierarchy);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve location hierarchy', details: err?.message });
  }
};

export const createBuilding = async (req: Request, res: Response) => {
  try {
    const { campusId, name, code, latitude, longitude } = req.body;
    if (!campusId || !name || !code) {
      return res.status(400).json({ error: 'campusId, name, and code are required' });
    }
    const building = await dbRepository.createBuilding(campusId, name, code, latitude, longitude);
    res.status(201).json(building);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create building', details: err?.message });
  }
};

export const createFloor = async (req: Request, res: Response) => {
  try {
    const { buildingId, level } = req.body;
    if (!buildingId || !level) {
      return res.status(400).json({ error: 'buildingId and level are required' });
    }
    const floor = await dbRepository.createFloor(buildingId, level);
    res.status(201).json(floor);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create floor', details: err?.message });
  }
};

export const createArea = async (req: Request, res: Response) => {
  try {
    const { floorId, name, roomNumber } = req.body;
    if (!floorId || !name) {
      return res.status(400).json({ error: 'floorId and name are required' });
    }
    const area = await dbRepository.createArea(floorId, name, roomNumber);
    res.status(201).json(area);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create area', details: err?.message });
  }
};
