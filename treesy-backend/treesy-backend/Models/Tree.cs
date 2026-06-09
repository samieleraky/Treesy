using System;

namespace treesy_backend.Models
{
    public class Tree //Træ klasse med tilhørende egenskaber. Get og set til at læse og opdatere egenskaberne
    {
        public Guid Id { get; set; } = Guid.NewGuid(); 
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public DateTime PlantedAt { get; set; } = DateTime.UtcNow;
    }
}