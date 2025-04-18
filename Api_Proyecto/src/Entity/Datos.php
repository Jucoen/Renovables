<?php

namespace App\Entity;

use App\Repository\DatosRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DatosRepository::class)]
class Datos
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $WindSpeed = null;

    #[ORM\Column]
    private ?float $SolarIrradiance = null;

    #[ORM\Column(length: 40)]
    private ?string $Location = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWindSpeed(): ?float
    {
        return $this->WindSpeed;
    }

    public function setWindSpeed(float $WindSpeed): static
    {
        $this->WindSpeed = $WindSpeed;

        return $this;
    }

    public function getSolarIrradiance(): ?float
    {
        return $this->SolarIrradiance;
    }

    public function setSolarIrradiance(float $SolarIrradiance): static
    {
        $this->SolarIrradiance = $SolarIrradiance;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->Location;
    }

    public function setLocation(string $Location): static
    {
        $this->Location = $Location;

        return $this;
    }
}
