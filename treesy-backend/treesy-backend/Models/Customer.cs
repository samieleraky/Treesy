
namespace treesy_backend.Models

{
    public class Customer
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? StripeCustomerId { get; set; }
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = ""; // For email/password (authentication)
        public string? Name { get; set; }
        public string? Company { get; set; }
        public string CustomerType { get; set; } = "private"; // "private" | "business"
        public int TotalTreesPlanted { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Subscription> Subscriptions { get; set; } = [];
        public ICollection<Order> Orders { get; set; } = [];

    }
}
