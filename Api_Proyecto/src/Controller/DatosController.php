<?php

namespace App\Controller;

use App\Entity\Datos;
use App\Repository\DatosRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/datos')]
final class DatosController extends AbstractController
{
    #[Route('', name: 'api_datos_index', methods: ['GET'])]
    public function index(DatosRepository $datosRepository): JsonResponse
    {

        $datos = $datosRepository->findAll();
        $data = [];
        foreach ($datos as $dato) {
            $data[] = [
                'id' => $dato->getId(),
                'WindSpeed' => $dato->getWindSpeed(),
                'SolarIrradiance' => $dato->getSolarIrradiance(),
                'Location' => $dato->getLocation(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('', name: 'api_datos_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {

        $data = json_decode($request->getContent(), true);


        if (!isset($data['WindSpeed'], $data['SolarIrradiance'], $data['Location'])) {
            return new JsonResponse(['error' => 'Missing data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $dato = new Datos();
        $dato->setWindSpeed($data['WindSpeed']);
        $dato->setSolarIrradiance($data['SolarIrradiance']);
        $dato->setLocation($data['Location']);

        $entityManager->persist($dato);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $dato->getId(),
            'WindSpeed' => $dato->getWindSpeed(),
            'SolarIrradiance' => $dato->getSolarIrradiance(),
            'Location' => $dato->getLocation(),
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_datos_show', methods: ['GET'])]
    public function show(Datos $dato): JsonResponse
    {

        return new JsonResponse([
            'id' => $dato->getId(),
            'WindSpeed' => $dato->getWindSpeed(),
            'SolarIrradiance' => $dato->getSolarIrradiance(),
            'Location' => $dato->getLocation(),
        ]);
    }

    #[Route('/{id}', name: 'api_datos_edit', methods: ['PUT'])]
    public function edit(Request $request, Datos $dato, EntityManagerInterface $entityManager): JsonResponse
    {
        // Recibe los datos en formato JSON
        $data = json_decode($request->getContent(), true);

        if (isset($data['WindSpeed'])) {
            $dato->setWindSpeed($data['WindSpeed']);
        }
        if (isset($data['SolarIrradiance'])) {
            $dato->setSolarIrradiance($data['SolarIrradiance']);
        }
        if (isset($data['Location'])) {
            $dato->setLocation($data['Location']);
        }

        $entityManager->flush();

        return new JsonResponse([
            'id' => $dato->getId(),
            'WindSpeed' => $dato->getWindSpeed(),
            'SolarIrradiance' => $dato->getSolarIrradiance(),
            'Location' => $dato->getLocation(),
        ]);
    }

    #[Route('/{id}', name: 'api_datos_delete', methods: ['DELETE'])]
    public function delete(Datos $dato, EntityManagerInterface $entityManager): JsonResponse
    {

        $entityManager->remove($dato);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Dato eliminado'], JsonResponse::HTTP_NO_CONTENT);
    }
}